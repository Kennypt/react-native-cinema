import { Document } from 'mongoose';

export interface IInExhibition extends Document {
  country_code: string;
  list: Array<number>;
}
