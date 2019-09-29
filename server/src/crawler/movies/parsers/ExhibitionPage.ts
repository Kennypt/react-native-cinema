import $ from 'cheerio';

export default class ExhibitionPageParser {
  private mainElem: any;

  constructor(mainElem) {
    this.mainElem = mainElem;
  }

  public getRegions() {
    const regions = [];

    $(this.mainElem).find('h3').each((index, value) => regions.push({
      name: $(value).text(),
      theaters: [],
    }));

    return regions;
  }
};
