/**
 * User Model for Database
 */
import mongoose, { Document, Schema } from "mongoose";
import {
  comparePassword,
  preSaveHashPassword,
  preUpdateHashPassword
} from "./dbHelpers";

/**
 * Creates interface for the user
 */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  settings: Settings;
  address: Address;
  updates: Update[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface Address {
  street: string;
  city: string;
  zipCode: string;
}

export interface Update {
  status: string;
  title: string;
  message: string;
  read: boolean;
}

export interface Settings {
  themeName: string;
}

/**
 * User Schema for use in Mongodb
 */
export const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

preSaveHashPassword(userSchema);
preUpdateHashPassword(userSchema);
comparePassword(userSchema);

export const model = mongoose.model<IUser>("User", userSchema);

export const cleanCollectionOfTestUsers = () => model.deleteMany({}).exec();

export default model;
