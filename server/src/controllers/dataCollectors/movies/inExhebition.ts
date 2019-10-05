import Crawler from 'crawler';

import InExhibition from '../../../models/noSql/inExhibition.model';
import parseExhibitionPage from '../../../crawler/movies/inExhibition';
import config from '../../../config';
import saveMoviesInfo from './info';

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
const persistInExhibitionNow = async (moviesIdsList) => {
  try {
    console.log('_________save in exhibition: ', moviesIdsList);
    await InExhibition.findOneAndUpdate(
      {
        key: 'now',
      },
      {
        key: 'now',
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

const handleInExhibitionData = async (error, res, done) => {
  if (error) {
    console.log(error);
  } else {
    const inExhibitionList = parseExhibitionPage(res);
    await persistInExhibitionNow(inExhibitionList);
    await saveMoviesInfo(inExhibitionList);
  }
  done();
};

export default () => {
  cralwer.queue([{
    uri: `${config.crawlers.filmspot.basePath}/ajax/novocartazfilmes.php`,
    callback: handleInExhibitionData,
  }]);
}
