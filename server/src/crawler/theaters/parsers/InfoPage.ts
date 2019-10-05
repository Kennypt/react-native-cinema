import $ from 'cheerio';

import { DESC_PRICES_CAN_CHANGE } from '../utils/descriptions';
import { DAYS_OF_WEEK_MATCHES, REGEX_FROM_DOW_TO_DOW } from '../utils/daysOfWeekMatches';
import { TICKET_TYPES } from '../utils/ticketTypes';

export default class InfoPageParser {
  private mainElem: any;
  private addressElem: any;
  private headerElem: any;
  private ticketPricesPlainTextArray: [string];

  constructor(mainElem) {
    this.mainElem = mainElem;
    this.headerElem = $(mainElem).find('#contentsNoSidebar .cinemaMorada');
    this.addressElem = $(this.headerElem).find('[itemprop=address]').first();
    this.ticketPricesPlainTextArray = $(mainElem).find('.cinemaPrecos').text().toLowerCase().replace('\r', '').trim().split('\n');
  }

  public getName() {
    return $(this.headerElem).find('h1').first().text();
  }

  public getAddressMapsLink() {
    return $(this.headerElem).find('.cinemaMoradaLink').first().attr('href');
  }

  public getPhoneNumber() {
    return $(this.headerElem).find('[itemprop=telephone]').first().text();
  }

  public getAddressData() {
    return {
      name: $(this.addressElem).find('[itemprop=name]').first().text(),
      street: $(this.addressElem).find('[itemprop=streetAddress]').first().text(),
      postalCode: $(this.addressElem).find('[itemprop=postalCode]').first().text(),
      locality: $(this.addressElem).find('[itemprop=addressLocality]').first().text(),
      region: $(this.addressElem).find('[itemprop=addressRegion]').first().text(),
      country: $(this.addressElem).find('[itemprop=addressCountry]').first().text(),
    };
  }

  private getSessionSchedule(elem) {
    const sessionSchedule = [];
    $(elem).find('td').each((scheduleIndex, schedule) => {
      const time = $(schedule).text().replace('VP', '').replace('VO', '').trim();
      if (!time) {
        return;
      }

      const theaterSessionInfo = $(schedule).find('.cinemaSessaoInfo');
      const infoAbbr = $(theaterSessionInfo).text();
      const infoDesc = $(theaterSessionInfo).attr('title');

      sessionSchedule.push({
        time,
        infoAbbr,
        infoDesc,
      });
    });
    return sessionSchedule;
  }

  private getRoomSessions(elem) {
    const roomSessions = [];
    $(elem).find('tr').each((lineIndex, line) => {
      if (lineIndex === 0) {
        return;
      }

      const dayOfWeek = $(line).find('.cinemaCartazDiaSemana').text();
      const day = $(line).find('.cinemaCartazDia').text();

      roomSessions.push({
        day,
        dayOfWeek,
        sessionSchedule: this.getSessionSchedule(line),
      });
    });
    return roomSessions;
  }

  public getNowPlayingMovies() {
    const nowPlayingMovies = [];
    const handledMovies = [];

    $(this.mainElem).find('a[name]').each((index, movieElem) => {
      const movieId = $(movieElem).attr('name');

      if (movieId && !handledMovies.includes(movieId)) {
        handledMovies.push(movieId);
        const sessions = $(movieElem).find('.cinemaTabelaSessoes');
        let hasRoom = false;

        const theaterSessions = [];
        $(sessions).each((sessionIndex, session) => {
          const roomNumber = $(session).find('th.sala').first().text();
          const theaterSession = {
            roomNumber,
            roomSessions: [],
          };

          if (roomNumber) {
            hasRoom = true;
            theaterSession.roomSessions = this.getRoomSessions(session);;
            theaterSessions.push(theaterSession);
          }
        });

        if (hasRoom) {
          nowPlayingMovies.push({
            movieId: parseInt(movieId, 10),
            theaterSessions,
          });
        }
      }
    });

    return nowPlayingMovies;
  }

  public has3D() {
    return this.ticketPricesPlainTextArray.join(' ').includes('3d');
  }

  public hasImax() {
    return this.ticketPricesPlainTextArray.join(' ').includes('imax');
  }

  private getPriceTypesByDescription(desc = '') {
    const types = [];

    Object.entries(TICKET_TYPES).forEach(([key, value]) => {
      if (value.excludes && desc.match(value.excludes)) {
        return;
      }

      if (desc.match(value.matches)) {
        types.push(key);
      }
    });

    let daysOfWeek = [];
    let startTime;
    let endTime;
    let isValidOnHolidays = true;
    let isAddition = false;
    let isExtras = false;

    if (['óculos 3d'].includes(desc)) {
      isExtras = true;
    }

    if (!isExtras) {
      if (desc.includes('suplemento') ||
        desc.includes('acréscimo') ||
        desc.includes('acrescimo') ||
        desc.startsWith('+')
      ) {
        isAddition = true;
      }
    }

    Object.entries(DAYS_OF_WEEK_MATCHES).forEach(([key, value]) => {
      if (desc.match(value.matches)) {
        daysOfWeek.push(key);
      }
    });

    if (daysOfWeek.length === 2 && (desc.match(REGEX_FROM_DOW_TO_DOW))) {
      const dowKeys = Object.keys(DAYS_OF_WEEK_MATCHES);
      const startIndex = dowKeys.findIndex(key => key === daysOfWeek[0]);
      const endIndex = dowKeys.findIndex(key => key === daysOfWeek[1]);

      daysOfWeek = [];
      for (let i = startIndex; i <= endIndex; i++) {
        daysOfWeek.push(dowKeys[i]);
      }
    }

    if (desc.includes('exceto feriados') || desc.includes('excepto feriados')) {
      isValidOnHolidays = false;
    }

    if (desc.includes('meia-noite')) {
      startTime = '00:00';
    }

    const endTimeRegex = desc.match(/até às (\d{1,2}h\d{0,2})/);
    if (endTimeRegex && endTimeRegex[1]) {
      endTime = (endTimeRegex[1], '').replace('h', ':');
    }

    if (
      !types.length &&
      !daysOfWeek.length &&
      !startTime &&
      !endTime &&
      isValidOnHolidays &&
      !isAddition &&
      !isExtras
    ) {
      return [];
    }

    return {
      values: types,
      daysOfWeek,
      startTime,
      endTime,
      isValidOnHolidays,
      isAddition,
      isExtras,
    };
  }

  private getPriceTypes(descriptions = []) {
    return descriptions.reduce((acc, description) => {
      return acc.concat(this.getPriceTypesByDescription(description));
    }, []);
  }

  public getTicketPrices() {
    const ticketPrices = {
      default: [],
      special: [],
      extras: [],
    };

    let ticketSpecialType;
    let isFamilyTicket = false;
    let isComplexTicket = false;

    this.ticketPricesPlainTextArray.forEach((ticketPriceText, index) => {
      if (!ticketPriceText || isFamilyTicket) {
        ticketSpecialType = undefined;
        return;
      }

      let ticketCleanText = ticketPriceText.replace('preço dos bilhetes:', '').replace(DESC_PRICES_CAN_CHANGE, '').replace('\r', '');
      if (ticketCleanText.startsWith('*')) {
        ticketSpecialType = undefined;
        ticketPrices.extras.push(ticketCleanText);
        return;
      }

      if (ticketCleanText.startsWith('(')) {
        ticketSpecialType = ticketCleanText;
        return;
      }

      if (ticketCleanText.startsWith('bilhete família')) {
        isFamilyTicket = true;
        const newPriceDesc = `${this.ticketPricesPlainTextArray[index + 1]} ${this.ticketPricesPlainTextArray[index + 2]}`.replace(DESC_PRICES_CAN_CHANGE, '').replace('\r', '');
        ticketPrices.default.push({
          types: this.getPriceTypes([ticketCleanText, newPriceDesc]),
          description: ticketCleanText,
          priceDesc: newPriceDesc,
          price: parseFloat(this.ticketPricesPlainTextArray[index + 1].replace(',', '.').match(/(\d+\.\d{1,2})/)[0]),
        });
        return;
      }

      if (isComplexTicket) {
        return;
      }

      if (ticketCleanText.startsWith('bilhete a preço reduzido ')) {
        isComplexTicket = true;
        const [newDesc, newPriceDesc] = `${ticketCleanText} ${this.ticketPricesPlainTextArray[index + 1]}`.replace('\r', '').split(': ');
        ticketPrices.default.push({
          types: this.getPriceTypes([newDesc, newPriceDesc]),
          description: newDesc,
          priceDesc: newPriceDesc,
          price: parseFloat(newPriceDesc),
        });
        return;
      }

      let [desc, price] = ticketCleanText.split(': ');
      if (!price) {
        [desc, price] = ticketCleanText.split(' - ');
      }

      if (!price) {
        [desc, price] = ticketCleanText.split(' €');
      }

      let priceDesc;
      let priceVal;
      if (!price) {
        console.log('WARN: missing price value');
      } else {
        priceDesc = price[price.length - 1].match(/[a-zA-Z\.\)]/) ? price : `${price.replace('€', '')}€`;
        priceVal = parseFloat(priceDesc.replace('€', '').trim().replace(',', '.'));

        if (!priceVal) {
          priceVal = parseFloat(priceDesc.match(/\d+/)[0]);
        }
      }

      if (!desc) {
        return;
      }

      if (ticketSpecialType) {
        ticketPrices.special.push({
          campaign: ticketSpecialType,
          types: this.getPriceTypes([desc, priceDesc, ticketSpecialType]),
          description: desc,
          price: priceVal || 0,
          priceDesc: priceDesc || '',
        });
        return;
      }

      ticketPrices.default.push({
        types: this.getPriceTypes([desc, priceDesc]),
        description: desc,
        price: priceVal || 0,
        priceDesc: priceDesc || '',
      });

    });

    return ticketPrices;
  }
};
