import moment from 'moment';

import { getMovieInfoById } from '../../../upstreams/tmdb/movies'
import Locales from '../../../enums/locales';
import MovieInfoModel from '../../../models/noSql/movieInfo.model';

export const getMovieById = async (movieId: number, locale: Locales = Locales.PT_PT) => {
  let movieInfo = await MovieInfoModel.findById(`${movieId}`);
  if (movieInfo) {
    // TODO: Move to a thread
    const updatedAt = moment.utc(movieInfo.updatedAt.$date);
    if (updatedAt.isBefore(moment.utc().subtract('2d'))) {
      movieInfo = await getMovieInfoById(`${movieId}`, locale);
      await MovieInfoModel.findByIdAndUpdate({
        _id: `${movieId}`,
      },
      movieInfo,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      });
    }
  } else {
    movieInfo = await getMovieInfoById(`${movieId}`, locale);
    if (movieInfo) {
      // TODO: Move to a thread
      movieInfo._id = `${movieInfo.id}`;
      await MovieInfoModel.create(movieInfo, {
        setDefaultsOnInsert: true
      });
    }
  }

  return movieInfo;
}

export default (movieIds: Array<number>, locale?: Locales) => {
  movieIds.forEach((movieId: number) => getMovieById(movieId, locale));
}


// TODO: Add delete movies older than a month
