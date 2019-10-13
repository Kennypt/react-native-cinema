import request from 'request-promise';

import config from '../../config';
import LocaleCodes from '../../enums/locales';

export const getMovieInfoById = async (movieId: string, locale: LocaleCodes = LocaleCodes.PT_PT) => {
  try {
    return await request({
      uri: `${config.upstreams.tmdb.basePath}/movie/${movieId}?api_key=${config.upstreams.tmdb.keyV3}&language=${locale}`,
      json: true,
    });
  } catch(err) {
    console.log('ERROR - Not able to get movie data', err);
    // TODO: throw custom error
  }
};

export const getGenresByLocale = async (locale: LocaleCodes = LocaleCodes.PT_PT) => {
  try {
    return await request({
      uri: `${config.upstreams.tmdb.basePath}/genre/movie/list?api_key=${config.upstreams.tmdb.keyV3}&language=${locale}`,
      json: true,
    });
  } catch (err) {
    console.log('ERROR - Not able to get genres data', err);
    // TODO: throw custom error
  }
};

