import { Document } from 'mongoose';

interface ITheater {
  name: string;
  uri: string;
}

interface ILocation {
  name: string;
  theaters: Array<ITheater>;
}

export interface ITheaterLocation extends Document {
  name: string;
  code: string;
  regions: Array<ILocation>;
}
