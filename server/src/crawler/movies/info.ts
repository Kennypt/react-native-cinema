import $ from 'cheerio';
import getGenres from '../../controllers/dataCollectors/movies/genres';
import LocaleCodes from '../../enums/locales';
import MovieInfoModel from '../../models/noSql/movieInfo.model';

export default async (id, document): Promise<MovieInfoModel> => {
  const allGenres = await getGenres(LocaleCodes.PT_PT);

  const title = document.$('span[itemprop=name]').first().text();
  const release_date = document.$('span[itemprop=copyrightYear]').text();
  const overview = document.$('div[itemprop=description]').first().text();
  const poster_url = document.$('a[itemprop=image]').attr('href');
  const imdb_id = (document.$('a[itemprop=sameAs]').first().attr('href') || '').replace('https://www.imdb.com/title/', '').replace('/', '');
  const adult = document.$('span[itemprop=contentRating]').text() === 'M/18';
  const genresDesc = [];
  document.$('span[itemprop=genre]').each((index, value) => {
    genresDesc.push($(value).text());
  });
  const genres = allGenres.filter(({ name }) => genresDesc.includes(name));

  return new MovieInfoModel({
    id,
    locale: LocaleCodes.PT_PT,
    original_language: 'pt',
    title,
    original_title: title,
    overview,
    release_date,
    poster_url,
    imdb_id,
    adult,
    genres,
    video: false,
    budget: 0,
    revenue: 0,
  });
};
