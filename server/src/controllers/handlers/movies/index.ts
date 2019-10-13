
import InExhibitionModel from '../../../models/noSql/inExhibition.model';
import TheaterInfoModel from '../../../models/noSql/theaterInfo.model';
import getMoviesInfos from '../../dataCollectors/movies/info';
import countriesEnum from '../../../enums/countries';
import BackdropSizes from '../../../enums/backdropSizes';
import PosterSizes from '../../../enums/posterSizes';
import Locales from '../../../enums/locales';

export const getMoviesInExhibition = async ({
  theater_ids = [],
  movie_genres = [],
  country_code = countriesEnum.PORTUGAL,
  adult = true,
  backdrop_size,
  poster_size,
  locale = Locales.PT_PT,
 }: {
  theater_ids?: string[];
  country_code: string;
  movie_genres?: string[];
  user_types?: string[];
  adult?: boolean;
  backdrop_size?: BackdropSizes;
  poster_size?: PosterSizes;
  locale?: Locales;
}) => {
  try {
    if (!theater_ids.length) {
      // get all movies in exhibition
      const allInExhibition = await InExhibitionModel.findOne({ country_code });
      const moviesInfoInExhibition = await getMoviesInfos(allInExhibition.list, locale, poster_size, backdrop_size);
      let result = moviesInfoInExhibition;

      if (movie_genres.length) {
        result = (moviesInfoInExhibition).filter(({ genres = [] }) => {
          return genres.find(({ type }) => movie_genres.includes(type));
        });
      }

      if (!adult) {
        result = result.filter(({ adult }) => !adult);
      }

      return result;
    }

    const theaterInfoPromises = theater_ids.map(theaterId => TheaterInfoModel.findById(theaterId));
    const theaterInfos = await Promise.all(theaterInfoPromises);

    const movieIds = Array.from(new Set(theaterInfos.reduce((acc, { now_playing_movies }) => {
      acc.concat(now_playing_movies.map(({movie_id}) => movie_id));
      return acc;
    }, [])));

    const moviesInfoInExhibition = await getMoviesInfos(movieIds, locale, poster_size, backdrop_size);
    let result = moviesInfoInExhibition;

    if (movie_genres.length) {
      result = moviesInfoInExhibition.filter(({ genres = [] }) => {
        return genres.find(({ type }) => movie_genres.includes(type));
      });
    }

    return result;
  } catch(err) {
    console.log('controllers > handlers > movies > getMoviesInExhibition', err);
  }
  return [];
};
