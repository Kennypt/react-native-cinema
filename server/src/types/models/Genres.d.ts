import { Document } from 'mongoose';

interface IGenre {
  id: number;
  name: string;
}

export interface IGenres extends Document {
  locale: string;
  list: Array<IGenre>;
}
