import Crawler from 'crawler';

import parseLocationPage from '../../../crawler/theaters/locations'
import TheaterLocation from '../../../models/noSql/theaterLocation.model';
import CountryCodes from '../../../enums/countries';
import config from '../../../config';

// TODO: 1x MES

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
 * @param location
 */
const persistLocation = async (location) => {
  try {
    console.log('_________save location: ', location.code);
    await TheaterLocation.findOneAndUpdate(
      {
        code: location.code
      },
      location,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );
  } catch (err) {
    console.log('ERROR - Not able to update locations');
    // TODO: Save status
  }
};

/**
 *
 * @param locations
 */
const clearTheatersNotIn = async (locations) => {
  try {

    // TODO: Find theaters not in currentTheaterKeys and delete
  } catch (err) {
    console.log('ERROR - Not able to delete theaters');
  }
};

const handleTheaterLocationData = async (error, res, done) => {
  if (error) {
    console.log(error);
  } else {
    //console.log('>>>> res', res.$('h3'));
    const regions = parseLocationPage(res);

    if (!regions || !regions.length) {
      // TODO: Save status
      console.log('ERROR - Not able to crawl locations');
      return done();
    }

    const locations = [
      {
        name: 'Angola',
        code: CountryCodes.ANGOLA,
        regions: regions.filter(({ name }) => name === 'Angola'),
      },
      {
        name: 'Moçambique',
        code: CountryCodes.MOZAMBIQUE,
        regions: regions.filter(({ name }) => name === 'Moçambique'),
      },
      {
        name: 'Portugal',
        code: CountryCodes.PORTUGAL,
        regions: regions.filter(({ name }) => !['Moçambique', 'Angola'].includes(name)),
      }
    ];

    locations.forEach(persistLocation);
    clearTheatersNotIn(locations);

  }
  done();
}

export default () => {
  console.log('----', `${config.crawlers.filmspot.basePath}/ajax/novocartazsalas.php`);
  cralwer.queue([{
    uri: `${config.crawlers.filmspot.basePath}/ajax/novocartazsalas.php`,
    callback: handleTheaterLocationData,
  }])}
