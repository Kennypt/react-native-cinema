import moment from 'moment';
import Crawler from 'crawler';

import { getMovieInfoById } from '../../../upstreams/tmdb/movies'
import Locales from '../../../enums/locales';
import BackdropSizes from '../../../enums/backdropSizes';
import PosterSizes from '../../../enums/posterSizes';
import MovieInfoModel from '../../../models/noSql/movieInfo.model';
import TheaterInfoModel from '../../../models/noSql/theaterInfo.model';
import getMovieByDocument from '../../../crawler/movies/info';
import config from '../../../config';

const cralwer = new Crawler({
  maxConnections: 10,
  // This will be called for each crawled page
  callback: function (error, res, done) {
    if (error) {
      console.log(error);
    }
    done();
  }
});

const handleMovieFallback = (id, locale) => async (error, res, done) => {
  if (error) {
    console.log(error);
  } else {
    const movie = await getMovieByDocument(id, res);
    if (movie && movie.id) {
      const theaters = await TheaterInfoModel.find({ 'now_playing_movies': { $elemMatch: { movie_id: id } } });
      const theatersIds = theaters.map(({ _id }) => _id);
      movie.theater_ids = theatersIds;
      await MovieInfoModel.findOneAndUpdate({
        id,
        locale,
      },
      movie,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      });
    }
  }
  done();
};

const loadMovieByIdFallback = (movieId, locale) => {
  if (locale === Locales.PT_PT) {
    cralwer.queue([{
      uri: `${config.crawlers.filmspot.basePath}/filme/${movieId}`,
      callback: handleMovieFallback(movieId, locale),
    }]);
  }
};

export const getMovieById = async ({
  id,
}: {
  id: string,
  }, locale: Locales = Locales.PT_PT, posterSize?: PosterSizes = PosterSizes.ORIGINAL, backdropSize?: BackdropSizes = BackdropSizes.ORIGINAL) => {
  let movieInfo;
  try {
    console.log('____constrollers > dataCollectors > getMovieById >', id);
    movieInfo = await MovieInfoModel.findOne({ id, locale });
    if (movieInfo && movieInfo.id && movieInfo.locale) {
      // TODO: Move to a thread
      // TODO: Missing where the movie is available if in exhibition;
      const updatedAt = moment.utc(movieInfo.updatedAt);
      if (updatedAt.isBefore(moment.utc().subtract(2, 'd'))) {
        const uMovieInfo = await getMovieInfoById(id, locale);

        if (uMovieInfo && uMovieInfo.id) {
          uMovieInfo.locale = locale;
          // TODO: Only update in case of in exhebition update
          uMovieInfo.theater_ids = movieInfo.theater_ids;
          console.log('___update movie', id);
          await MovieInfoModel.findOneAndUpdate({
            id,
            locale,
          },
          uMovieInfo,
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
          });
          movieInfo = uMovieInfo;
        }
      }
    } else {
      movieInfo = await getMovieInfoById(id, locale);
      if (movieInfo && movieInfo.id) {
        const theaters = await TheaterInfoModel.find({ 'now_playing_movies': { $elemMatch: { movie_id: id } } } );
        const theatersIds = theaters.map(({ _id }) => _id);
        movieInfo.theater_ids = theatersIds;
        movieInfo.locale = locale;

        // TODO: Move to a thread
        // console.log('___create movie', movieInfo);
        await MovieInfoModel.create(movieInfo, {
          setDefaultsOnInsert: true
        });
      } else {
        loadMovieByIdFallback(id, locale);
      }
    }

    if (movieInfo) {
      // TODO: missing host from path
      let posterUrl = movieInfo.poster_url;
      if (!posterUrl && movieInfo.poster_path) {
        posterUrl = `${config.images.basePath}${posterSize}${movieInfo.poster_path}`;
      }
      movieInfo.poster_url = posterUrl;
    }
    return movieInfo;
  } catch(err) {
    console.log('ERROR: controllers > dataCollectors > movies > info', err);
  }
  return undefined;
}

export default async (ids: Array<number>, locale?: Locales, posterSize?: PosterSizes, backdropSize?: BackdropSizes) => {
  return await Promise.all(
    ids.map((id: number) => getMovieById({
      id: `${id}`,
    }, locale, posterSize, backdropSize))
  );
}



// TODO: Add delete movies older than a month
