import InfoPageParser from './parsers/InfoPage';

export default (uri: string) => (document) => {
  const theaterInfoData = new InfoPageParser(document.$('#contents'));
  return {
    name: theaterInfoData.getName(),
    uri: uri,
    maps_uri: theaterInfoData.getAddressMapsLink(),
    phone_number: theaterInfoData.getPhoneNumber(),
    now_playing_movies: theaterInfoData.getNowPlayingMovies(),
    ticket_prices: theaterInfoData.getTicketPrices(),
    has_3d: theaterInfoData.has3D(),
    has_imax: theaterInfoData.hasImax(),
    address: theaterInfoData.getAddressData(),
  };
};
