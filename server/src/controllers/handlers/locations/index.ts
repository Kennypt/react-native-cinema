import TheaterLocationModel from '../../../models/noSql/theaterLocation.model';

export default async ({ country_code, name }: {
  country_code: string;
  name?: string;
}) => {
  const queryParams: {
    code?: string;
    name?: string;
  } = {};

  if (country_code) {
    queryParams.code = country_code;
  }

  if (name) {
    queryParams.name = name;
  }

  const theaterLocation = await TheaterLocationModel.findOne(queryParams);

  return theaterLocation;
};
