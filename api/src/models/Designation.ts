import mongoose, { Document, Schema } from 'mongoose';

export interface IDesignation extends Document {
    title: string;
}

const DesignationSchema: Schema = new Schema({
    title: { type: String, required: true },
});

export default mongoose.model<IDesignation>('Designation', DesignationSchema);
