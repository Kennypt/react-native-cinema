import { Document } from 'mongoose';

export interface ICron extends Document {
  name: string;
  startDate: number;
  endDate: number;
  status: string;
}
