import mongoose, { Document, Schema } from 'mongoose';

export interface ILocation extends Document {
  location: {
    type: string;
    coordinates: number[];
  };
}

const LocationSchema: Schema = new Schema({
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

export default mongoose.model<ILocation>('Location', LocationSchema);
