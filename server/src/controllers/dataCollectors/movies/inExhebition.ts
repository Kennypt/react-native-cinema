import Crawler from 'crawler';

import InExhibition from '../../../models/noSql/inExhibition.model';
import parseExhibitionPage from '../../../crawler/movies/inExhibition';
import config from '../../../config';
import saveMoviesInfo from './info';
import localesEnum from '../../../enums/locales';
import CountryCodes from '../../../enums/countries';

// TODO: 1X SEMANA?

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

/**
 *
 * @param moviesIdsList
 */
const persistInExhibitionNow = async (moviesIdsList, countryCode) => {
  try {
    console.log('_________save in exhibition: ', moviesIdsList);
    await InExhibition.findOneAndUpdate(
      {
        country_code: countryCode,
      },
      {
        country_code: countryCode,
        list: moviesIdsList,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
  } catch (err) {
    console.log('ERROR - Not able to update in exhibition', err);
    // TODO: Save status
  }
};

const handleInExhibitionDataPT = async (error, res, done) => {
  if (error) {
    console.log(error);
  } else {
    const inExhibitionList = parseExhibitionPage(res);
    await persistInExhibitionNow(inExhibitionList, CountryCodes.PORTUGAL);
    await saveMoviesInfo(inExhibitionList, localesEnum.PT_PT);
  }
  done();
};

export default (countryCode: CountryCodes = CountryCodes.PORTUGAL) => {
  if (countryCode === CountryCodes.PORTUGAL) {
    cralwer.queue([{
      uri: `${config.crawlers.filmspot.basePath}/ajax/novocartazfilmes.php`,
      callback: handleInExhibitionDataPT,
    }]);
  }
}
