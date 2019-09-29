import Parser from 'rss-parser';

let parser = new Parser();

// 1x WEEK - TUESDAY 2am

export default async () => {
  const feed = await parser.parseURL('https://filmspot.pt/feed/estreias/');
  let pubDate;

  const movieIds = feed.items.map(item => {
    if (!pubDate) {
      pubDate = item.isoDate;
    }
    const regexMovieId = /\-(\d+)\/$/;
    return item.link.match(regexMovieId)[1];
  });

  const permieresOfTheWeek = {
    pubDate,
    movieIds,
  };

  console.log('____premieres-of-the-week', permieresOfTheWeek);
};
