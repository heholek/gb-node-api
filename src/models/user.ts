import * as bcrypt from "bcryptjs";
import mongoose, { Document, Schema } from "mongoose";

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

/**
 * Before saving user, hashes the password
 */
userSchema.pre("save", function(next) {
  const originalPassword = this.get("password");
  bcrypt.hash(originalPassword, 10, (err, hash) => {
    this.set("password", hash);
    // console.log("done");
    next();
  });
});
/**
 * Before updating the user hashes user
 */
userSchema.pre("findOneAndUpdate", function(next) {
  // @ts-ignore
  const originalPassword = this.get("password");
  bcrypt.hash(originalPassword, 10, (err, hash) => {
    // @ts-ignore
    this._update.password = hash;
    this.update();
    next();
  });
});

/**
 * Compares passwords for logging in
 * @param candidatePassword
 */
userSchema.methods.comparePassword = function(
  candidatePassword: string
): Promise<boolean> {
  const password = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, password, (err, success) => {
      if (err) {
        return reject(err);
      }
      return resolve(success);
    });
  });
};

export const model = mongoose.model<IUser>("User", userSchema);

export const cleanCollectionOfTestUsers = () => model.deleteMany({}).exec();

export default model;
