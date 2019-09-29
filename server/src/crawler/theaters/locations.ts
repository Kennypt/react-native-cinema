import Crawler from 'crawler';
import $ from 'cheerio';

import LocationPageParser from './parsers/LocationPage';
import TheaterLocation from '../../models/noSql/theaterLocation.model';
import CountryCodes from '../../enums/countries';

// TODO: 1X MÊS

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


export default () => {
  cralwer.queue([{
    uri: 'https://filmspot.pt/ajax/novocartazsalas.php',
    callback: async function (error, res, done) {
      if (error) {
        console.log(error);
      } else {
        const locationPageData = new LocationPageParser(res.$('body'));
        const regions = locationPageData.getRegions();

        if (!regions.length) {
          // TODO: Save status
          console.log('ERROR - Not able to crawl locations');
          return done();
        }

        let regionCounter = -1;
        const currentTheaterKeys = [];
        res.$('ul').each((index, value) => {
          const regionTheaters = [];

          if ($(value).prev().get(0) && $(value).prev().get(0).tagName === 'h3') {
            regionCounter += 1;
          }

          $(value).find('li').each((indexLi, valueLi) => {
            const theaterName = $(valueLi).text().replace('- ', '');
            currentTheaterKeys.push(theaterName);

            regionTheaters.push({
              name: theaterName,
              uri: `https://filmspot.pt${$(valueLi).find('a').attr('href')}`,
            });
          });

          regions[regionCounter].theaters = regionTheaters;
        });

        const locations = [
          {
            name: 'Angola',
            code: CountryCodes.ANGOLA,
            regions: regions.filter(({name}) => name === 'Angola'),
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

        try {
          locations.forEach(async location => {
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
          });
        } catch(err) {
          console.log('ERROR - Not able to update locations');
          // TODO: Save status
        }

        try {

          // TODO: Find theaters not in currentTheaterKeys and delete
        } catch (err) {
          console.log('ERROR - Not able to delete theaters');
        }
      }
      done();
    }
  }])
};
