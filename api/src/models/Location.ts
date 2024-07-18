import mongoose, { Document, Schema } from 'mongoose';

export interface ILocation extends Document {
  name: string;
}

const LocationSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  }
});

export default mongoose.model<ILocation>('Location', LocationSchema);
