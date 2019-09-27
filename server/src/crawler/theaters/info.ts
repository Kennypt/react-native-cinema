import Crawler from 'crawler';
import $ from 'cheerio';

import config from '../../config';
import TheaterInfo from '../../models/theaterInfo.model';
import TheaterLocation from '../../models/theaterLocation.model';

// TODO: 1X MÊS

const DAYS_OF_WEEK_MATCHES = {
  mon: {
    values: ['segunda-feira', '2ª', 'seg.', '2a. feira'],
    matches: /segunda\-feira|2ª|seg\.|2a\. feira/,
  },
  tue: {
    values: ['terça-feira', '3ª', '3a.feira'],
    matches: /terça\-feira|3ª|3a\. feira/,
  },
  wed: {
    values: ['quarta-feira', '4ª', '4a.feira'],
    matches: /quarta\-feira|4ª|4a\. feira/,
  },
  thu: {
    values: ['quinta-feira', '5ª', '5a.feira'],
    matches: /quinta\-feira|5ª|5a\. feira/,
  },
  fri: {
    values: ['sexta-feira', '6ª', '6a.feira'],
    matches: /sexta\-feira|6ª|6a\. feira/,
  },
  sat: {
    values: ['sabado', 'sábado'],
    matches: /sabado|sábado/,
  },
  sun: {
    values: ['domingo'],
    matches: /domingo/,
  },
};

const TICKET_TYPES = {
  normal: {
    description: 'Normal',
    matches: /normal|adulto/,
    excludes: /family/,
    discount: false,
  },
  family: {
    description: 'Familia',
    matches: /family/,
    excludes: undefined,
    discount: false,
  },
  ucicard: {
    description: 'Cartão UCICARD',
    matches: /ucicard/,
    excludes: undefined,
    discount: true,
  },
  tripass: {
    description: 'Cartão Tripass',
    matches: /tripass/,
    excludes: undefined,
    discount: true,
  },
  student: {
    description: 'Estudante',
    matches: /estudante|est\./,
    excludes: undefined,
    discount: true,
  },
  youngCard: {
    description: 'Cartão jovem',
    matches: /cartão jovem|cartao jovem|c\. jovem/,
    excludes: undefined,
    discount: true,
  },
  infant: {
    description: 'Crianças até aos 10 anos',
    matches: /10 anos/,
    excludes: /family/,
    discount: true,
  },
  child: {
    description: 'Crianças até aos 12 anos',
    matches: /12 anos|criança/,
    excludes: /10 anos|family/,
    discount: true,
  },
  senior: {
    description: 'Sénior',
    matches: /65 anos|senior|sénior|3ª idade/,
    excludes: undefined,
    discount: true,
  },
  '3d': {
    description: '3D',
    matches: /3d/,
    excludes: undefined,
    discount: false,
  },
  imax: {
    description: 'IMAX',
    matches: /imax/,
    excludes: undefined,
    discount: false,
  },
  vip: {
    description: 'VIP',
    matches: /vip/,
    excludes: undefined,
    discount: false,
  }
}

let dowRegex = '';
Object.values(DAYS_OF_WEEK_MATCHES).forEach((dow) => {
  if (dowRegex) {
    dowRegex += '|';
  }
  dowRegex += dow.values.map((dowType) => dowType.replace('-', '\-'.replace('ª', '\ª').replace('.', '\.'))).join('|')
})
const REGEX_FROM_DOW_TO_DOW = new RegExp(`(${dowRegex}) (a|até)\ (${dowRegex})`);

const PRICES_CAN_CHANGE = 'os preços podem ser alterados pelo cinema a qualquer momento.';

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

const getPriceTypesByDescription = (desc = '', priceDesc = '', campaign = '') => {
  const types = [];

  Object.entries(TICKET_TYPES).forEach(([key, value]) => {
    if (value.excludes && desc.match(value.excludes)) {
      return;
    }

    if (value.excludes && priceDesc.match(value.excludes)) {
      return;
    }

    if (desc.match(value.matches)) {
      types.push(key);
    }

    if (priceDesc.match(value.matches)) {
      types.push(key);
    }
  });

  let daysOfWeek = [];
  let startTime;
  let endTime;
  let isValidOnHolidays = true;
  let isAddition = false;
  let isExtras = false;

  if (desc.includes('suplemento') ||
      priceDesc.includes('suplemento') ||
      desc.includes('acréscimo') ||
      priceDesc.includes('acréscimo') ||
      desc.includes('acrescimo') ||
      priceDesc.includes('acrescimo') ||
      (desc === 'cadeiras vip' && priceDesc.startsWith('+'))
  ) {
    isAddition = true;
  }

  if (['óculos 3d'].includes(desc)) {
    isExtras = true;
  }

  Object.entries(DAYS_OF_WEEK_MATCHES).forEach(([key, value]) => {
    if (desc.match(value.matches)) {
      daysOfWeek.push(key);
    }

    if (priceDesc.match(value.matches)) {
      daysOfWeek.push(key);
    }

    if (campaign.match(value.matches)) {
      daysOfWeek.push(key);
    }
  });

  if (daysOfWeek.length === 2 && (desc.match(REGEX_FROM_DOW_TO_DOW) || priceDesc.match(REGEX_FROM_DOW_TO_DOW))) {
    const dowKeys = Object.keys(DAYS_OF_WEEK_MATCHES);
    const startIndex = dowKeys.findIndex(key => key === daysOfWeek[0]);
    const endIndex = dowKeys.findIndex(key => key === daysOfWeek[1]);

    daysOfWeek = [];
    for (let i = startIndex; i <= endIndex; i++) {
      daysOfWeek.push(dowKeys[i]);
    }
  }

  if (desc.includes('exceto feriados') || desc.includes('excepto feriados') || priceDesc.includes('exceto feriados') || priceDesc.includes('excepto feriados')) {
    isValidOnHolidays = false;
  }

  if (desc.includes('meia-noite')) {
    startTime = '00h00';
  }

  const endTimeRegex = desc.match(/até às (\d{1,2}h\d{0,2})/);
  if (endTimeRegex && endTimeRegex[1]) {
    endTime = endTimeRegex[1];
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
};

export default async(markets = config.markets) => {
  const locations = await TheaterLocation.find({ code: { $in: markets}});

  locations.forEach(location => {
    location.regions.forEach((region) => {
      region.theaters.forEach((theater) => {
        cralwer.queue([{
          uri: theater.uri,
          callback: async function (error, res, done) {
            if (error) {
              console.log(error);
            } else {
              const theaterMovies = [];
              const ticketPrices = {
                default: [],
                special: [],
                extras: [],
              };

              const theaterInfoElem = res.$('#contentsNoSidebar .cinemaMorada');
              const theaterAddressElem = $(theaterInfoElem).find('[itemprop=address]').first();

              const theaterName = $(theaterInfoElem).find('h1').first().text();
              const theaterAddressMapsLink = $(theaterInfoElem).find('.cinemaMoradaLink').first().attr('href');
              const theaterTelephone = $(theaterInfoElem).find('[itemprop=telephone]').first().text();

              const theaterAddressName = $(theaterAddressElem).find('[itemprop=name]').first().text();
              const theaterAddressStreet = $(theaterAddressElem).find('[itemprop=streetAddress]').first().text();
              const theaterAddressPostalCode = $(theaterAddressElem).find('[itemprop=postalCode]').first().text();
              const theaterAddressLocality = $(theaterAddressElem).find('[itemprop=addressLocality]').first().text();
              const theaterAddressRegion = $(theaterAddressElem).find('[itemprop=addressRegion]').first().text();
              const theaterAddressCountry = $(theaterAddressElem).find('[itemprop=addressCountry]').first().text();

              const handledMovies = [];
              res.$('a[name]').each((index, movieElem) => {
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
                      const roomSessions = [];
                      $(sessions).find('tr').each((lineIndex, line) => {
                        if (lineIndex === 0) {
                          return;
                        }

                        const dayOfWeek = $(line).find('.cinemaCartazDiaSemana').text();
                        const day = $(line).find('.cinemaCartazDia').text();

                        const sessionSchedule = [];
                        $(line).find('td').each((scheduleIndex, schedule) => {
                          const time = $(schedule).text().replace('VP', '').replace('VO', '').trim();
                          if (!time) {
                            return;
                          }

                          const infoAbbr = $(schedule).find('.cinemaSessaoInfo').text();
                          const infoDesc = $(schedule).find('.cinemaSessaoInfo').attr('title');

                          sessionSchedule.push({
                            time,
                            infoAbbr,
                            infoDesc,
                          });
                        });
                        roomSessions.push({
                          day,
                          dayOfWeek,
                          sessionSchedule
                        });
                        theaterSession.roomSessions = roomSessions;
                      });

                      theaterSessions.push(theaterSession);
                    }
                  });

                  if (hasRoom) {
                    theaterMovies.push({
                      movieId,
                      theaterSessions,
                    });
                  }
                }
              });

              let ticketSpecialType;
              let isFamilyTicket = false;
              let isComplexTicket = false;

              const ticketPricesText = res.$('.cinemaPrecos').text().toLowerCase().replace('\r', '').trim().split('\n');
              const has3D = ticketPricesText.includes('3d');
              const hasImax = ticketPricesText.includes('imax');

              ticketPricesText.forEach((ticketPriceText, index) => {
                if (!ticketPriceText || isFamilyTicket) {
                  ticketSpecialType = undefined;
                  return;
                }

                let ticketCleanText = ticketPriceText.replace('preço dos bilhetes:', '').replace(PRICES_CAN_CHANGE, '').replace('\r', '');
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
                  const newPriceDesc = `${ticketPricesText[index + 1]} ${ticketPricesText[index + 2]}`.replace(PRICES_CAN_CHANGE, '').replace('\r', '');
                  ticketPrices.default.push({
                    types: getPriceTypesByDescription(ticketCleanText, newPriceDesc),
                    description: ticketCleanText,
                    priceDesc: newPriceDesc,
                    price: parseFloat(ticketPricesText[index + 1].replace(',', '.').match(/(\d+\.\d{1,2})/)[0]),
                  });
                  return;
                }

                if (isComplexTicket) {
                  return;
                }

                if (ticketCleanText.startsWith('bilhete a preço reduzido ')) {
                  isComplexTicket = true;
                  const [ newDesc, newPriceDesc ] = `${ticketCleanText} ${ticketPricesText[index + 1]}`.replace('\r', '').split(': ');
                  ticketPrices.default.push({
                    types: getPriceTypesByDescription(newDesc, newPriceDesc),
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
                  priceDesc = price[price.length - 1].match(/[a-zA-Z\.\)]/)? price : `${price.replace('€', '')}€`;
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
                    types: getPriceTypesByDescription(desc, priceDesc, ticketSpecialType),
                    description: desc,
                    price: priceVal || 0,
                    priceDesc: priceDesc || '',
                  });
                  return;
                }

                ticketPrices.default.push({
                  types: getPriceTypesByDescription(desc, priceDesc),
                  description: desc,
                  price: priceVal || 0,
                  priceDesc: priceDesc || '',
                });

              });

              try {
                console.log('________theater:', theaterName);
                await TheaterInfo.findOneAndUpdate(
                  {
                    name: theaterName
                  },
                  {
                    name: theaterName,
                    uri: theater.uri,
                    mapsUri: theaterAddressMapsLink,
                    phoneNumber: theaterTelephone,
                    nowPlayingMovies: theaterMovies,
                    ticketPrices,
                    has3D,
                    hasImax,
                    address: {
                      name: theaterAddressName,
                      street: theaterAddressStreet,
                      postalCode: theaterAddressPostalCode,
                      locality: theaterAddressLocality,
                      region: theaterAddressRegion,
                      country: theaterAddressCountry,
                    }
                  },
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
      })
    });
  });
};
