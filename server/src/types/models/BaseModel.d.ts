import { Document } from 'mongoose';

export interface IBaseModel extends Document {
  createdAt: number;
  updatedAt: number;
}
