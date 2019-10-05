import InfoPageParser from './parsers/InfoPage';

export default (uri: string) => (document) => {
  const theaterInfoData = new InfoPageParser(document.$('#contents'));
  return {
    name: theaterInfoData.getName(),
    uri: uri,
    mapsUri: theaterInfoData.getAddressMapsLink(),
    phoneNumber: theaterInfoData.getPhoneNumber(),
    nowPlayingMovies: theaterInfoData.getNowPlayingMovies(),
    ticketPrices: theaterInfoData.getTicketPrices(),
    has3D: theaterInfoData.has3D(),
    hasImax: theaterInfoData.hasImax(),
    address: theaterInfoData.getAddressData(),
  };
};
