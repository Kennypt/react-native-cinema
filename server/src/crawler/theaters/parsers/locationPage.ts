import $ from 'cheerio';

export default class LocationPageParser {
  private mainElem: any;

  constructor(mainElem) {
    this.mainElem = mainElem;
  }

  public getRegions() {
    const regions = [];

    this.mainElem.$('h3').each((index, value) => regions.push({
      name: $(value).text(),
      theaters: [],
    }));

    return regions;
  }
};
