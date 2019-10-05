import Crawler from 'crawler';
import $ from 'cheerio';

import InExhibition from '../../models/noSql/inExhibition.model';

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


export default () => {
  cralwer.queue([{
    uri: 'https://filmspot.pt/ajax/novocartazfilmes.php',
    callback: async function (error, res, done) {
      if (error) {
        console.log(error);
      } else {

        const inExhibitionList = [];
        res.$('a').each((index, value) => {
          const href = $(value).attr('href');
          if (href) {
            const match = href.match(/\-(\d+)\/$/);
            if (match) {
              inExhibitionList.push(match[1]);
            }
          }
        });


        try {
          console.log('_________save in exhibition: ', inExhibitionList);
          await InExhibition.findOneAndUpdate(
            {
              key: 'now',
            },
            {
              key: 'now',
              list: inExhibitionList,
            },
            {
              upsert: true,
              new: true,
              setDefaultsOnInsert: true
            }
          );
        } catch (err) {
          console.log('ERROR - Not able to update in exhibition', err);
          // TODO: Save status
        }
      }
      done();
    }
  }])
};
