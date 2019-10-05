import $ from 'cheerio';

export default (document): Array<number> => {
  const inExhibitionList = [];
  document.$('a').each((index, value) => {
    const href = $(value).attr('href');
    if (href) {
      const match = href.match(/\-(\d+)\/$/);
      if (match) {
        const movieId = match[1] ? parseInt(match[1], 10) : undefined;
        if (movieId) {
          inExhibitionList.push(movieId);
        }
      }
    }
  });

  return inExhibitionList;
};
