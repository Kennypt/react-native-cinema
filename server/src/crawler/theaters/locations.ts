import $ from 'cheerio';

import LocationPageParser from './parsers/LocationPage';
import config from '../../config';

export default (document) => {
  const locationPageData = new LocationPageParser(document);
  const regions = locationPageData.getRegions();

  if (!regions.length) {
    return;
  }

  let regionCounter = -1;
  const currentTheaterKeys = [];
  document.$('ul').each((index, value) => {
    const regionTheaters = [];

    if ($(value).prev().get(0) && $(value).prev().get(0).tagName === 'h3') {
      regionCounter += 1;
    }

    $(value).find('li').each((indexLi, valueLi) => {
      const theaterName = $(valueLi).text().replace('- ', '');
      currentTheaterKeys.push(theaterName);

      regionTheaters.push({
        name: theaterName,
        uri: `${config.crawlers.filmspot.basePath}${$(valueLi).find('a').attr('href')}`,
      });
    });
    regions[regionCounter].theaters = regionTheaters;
  });

  return regions;
};
