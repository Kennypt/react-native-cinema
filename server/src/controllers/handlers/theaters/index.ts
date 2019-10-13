import TheaterInfoModel from '../../../models/noSql/theaterInfo.model';

export default async ({ name }: {
  name: string;
}) => {
  const theaterInfo = await TheaterInfoModel.findOne({ name });

  return theaterInfo;
};
