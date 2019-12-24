import * as bcrypt from "bcryptjs";
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  username: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

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

userSchema.pre("save", function(next) {
  const originalPassword = this.get("password");
  bcrypt.hash(originalPassword, 10, (err, hash) => {
    this.set("password", hash);
    console.log("done");
    next();
  });
});

userSchema.pre("update", function(next) {
  // @ts-ignore
  bcrypt.hash(this.password, 10, (err, hash) => {
    // @ts-ignore
    this.password = hash;
    next();
  });
});

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

export const cleanCollection = () => model.remove({}).exec();

export default model;
