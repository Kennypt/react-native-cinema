import Crawler from 'crawler';

import InfoPageParser from './parsers/InfoPage';
import config from '../../config';
import TheaterInfo from '../../models/noSql/theaterInfo.model';
import TheaterLocation from '../../models/noSql/theaterLocation.model';

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

export const crawlInfoPageUri = (uri) => {
  cralwer.queue([{
    uri,
    callback: async (error, res, done) => {
      if (error) {
        console.log(error);
      } else {
        const theaterInfoData = new InfoPageParser(res.$('#contents'));
        const theaterName = theaterInfoData.getName();
        const theaterInfo = {
          name: theaterName,
          uri: uri,
          mapsUri: theaterInfoData.getAddressMapsLink(),
          phoneNumber: theaterInfoData.getPhoneNumber(),
          nowPlayingMovies: theaterInfoData.getNowPlayingMovies(),
          ticketPrices: theaterInfoData.getTicketPrices(),
          has3D: theaterInfoData.has3D(),
          hasImax: theaterInfoData.hasImax(),
          address: theaterInfoData.getAddressData(),
        };

        try {
          console.log('________save theater info:', theaterName); //, JSON.stringify(theaterInfo, null, 2));

          await TheaterInfo.findOneAndUpdate(
            {
              name: theaterName
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

        done();
      }
    },
  }]);
}

export default async(markets = config.markets) => {
  const locations = await TheaterLocation.find({ code: { $in: markets}});

  locations.forEach(location => {
    location.regions.forEach((region) => {
      region.theaters.forEach((theater) => {
        crawlInfoPageUri(theater.uri);
      })
    });
  });
};
