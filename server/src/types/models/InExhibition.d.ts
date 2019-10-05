import { Document } from 'mongoose';

export interface IInExhibition extends Document {
  key: string;
  list: Array<number>;
}
