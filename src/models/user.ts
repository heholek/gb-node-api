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
  username: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * User Schema for use in Mongodb
 */
export const userSchema: Schema = new Schema(
  {
    name: String,
    username: {
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
