import Crawler from 'crawler';

import parseInfoPage from '../../../crawler/theaters/info'
import TheaterInfo from '../../../models/noSql/theaterInfo.model';
import TheaterLocation from '../../../models/noSql/theaterLocation.model';
import config from '../../../config';

// TODO: 1X DIA

const cralwer = new Crawler({
  maxConnections: 10,
  rateLimit: 15000,
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
 * @param theaterInfo
 */
const persistTheaterInfo = async (theaterInfo) => {
  try {
    console.log('________save theater info:', theaterInfo.theaterName); //, JSON.stringify(theaterInfo, null, 2));

    await TheaterInfo.findOneAndUpdate(
      {
        name: theaterInfo.theaterName
      },
      theaterInfo,
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

const buildHandler = (uri) => async (error, res, done) => {
  if (error) {
    console.log(error);
  } else {
    const theaterInfo = parseInfoPage(uri)(res);
    await persistTheaterInfo(theaterInfo);
  }
  done();
}

export default async (markets = config.markets) => {
  const locations = await TheaterLocation.find({ code: { $in: markets } });

  locations.forEach(location => {
    location.regions.forEach((region) => {
      region.theaters.forEach((theater) => {
        cralwer.queue([{
          uri: theater.uri,
          callback: buildHandler(theater.uri),
        }]);
      })
    });
  });
};
