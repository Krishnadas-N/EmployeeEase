import mongoose, { Document, Schema } from "mongoose";

export interface IEmployee extends Document {
  name: string;
  age: number;
  designation: Schema.Types.ObjectId;
  phone: string;
  employeeId: string;
  email: string;
  address: string;
  password: string;
  location: Schema.Types.ObjectId;
}

const EmployeeSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: { type: Number, required: true },
  designation: {
    type: Schema.Types.ObjectId,
    ref: "Designation",
    required: true,
  },
  phone: { type: String, required: true },
  employeeId: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  address: { type: String, required: true, maxlength: 100 },
  password: { type: String, required: true },
  location: { type: Schema.Types.ObjectId, ref: "Location", required: true },
});

export default mongoose.model<IEmployee>("Employee", EmployeeSchema);
