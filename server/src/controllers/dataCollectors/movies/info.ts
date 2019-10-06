import moment from 'moment';

import { getMovieInfoById } from '../../../upstreams/tmdb/movies'
import Locales from '../../../enums/locales';
import MovieInfoModel from '../../../models/noSql/movieInfo.model';

export const getMovieById = async ({
  id,
}: {
  id: string,
}, locale: Locales = Locales.PT_PT) => {
  console.log('____constrollers > dataCollectors > getMovieById >', id);
  let movieInfo = await MovieInfoModel.findOne({ id });
  if (movieInfo) {
    // TODO: Move to a thread
    // TODO: Missing where the movie is available if in exhibition;
    const updatedAt = moment.utc(movieInfo.updatedAt);
    if (updatedAt.isBefore(moment.utc().subtract(2, 'd'))) {
      movieInfo = await getMovieInfoById(id, locale);
      console.log('___update movie', id);
      await MovieInfoModel.findOneAndUpdate({
        id,
      },
      movieInfo,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      });
    }
  } else {
    movieInfo = await getMovieInfoById(id, locale);
    if (movieInfo) {
      // TODO: Move to a thread
      console.log('___create movie', id);
      await MovieInfoModel.create(movieInfo, {
        setDefaultsOnInsert: true
      });
    }
  }

  return movieInfo;
}

export default async (ids: Array<number>, locale?: Locales) => {
  return await Promise.all(
    ids.map((id: number) => getMovieById({
      id: `${id}`,
    }, locale))
  );
}


// TODO: Add delete movies older than a month
