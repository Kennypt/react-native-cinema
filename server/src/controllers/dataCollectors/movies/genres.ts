import { getGenresByLocale } from '../../../upstreams/tmdb/movies'
import Locales from '../../../enums/locales';
import GenresModel from '../../../models/noSql/genres.model';

export default async (locale: Locales = Locales.PT_PT, forceUpdate?: boolean) => {
  try {
    console.log('____constrollers > dataCollectors > genres >', locale);
    let genre = await GenresModel.findOne({ locale });
    if (!genre || forceUpdate) {
      const genresResult = await getGenresByLocale(locale);
      console.log('___genresResult', genresResult.genres);
      const uGenres = {
        locale,
        list: genresResult.genres,
      };

      await GenresModel.findOneAndUpdate({
        locale,
      },
      uGenres,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      });

      return uGenres.list;
    }

    return genre.list;
  } catch (err) {
    console.log('ERROR: controllers > dataCollectors > genres', err);
  }
  return undefined;
}




// TODO: Add delete movies older than a month
