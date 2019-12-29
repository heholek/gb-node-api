/**
 * Db Utility functions
 */
import * as bcrypt from "bcryptjs";
import { Schema } from "mongoose";

/**
 * Hashes password before save
 * @param schema
 */
export const preSaveHashPassword = (schema: Schema) => {
  schema.pre("save", function(next) {
    const originalPassword = this.get("password");
    bcrypt.hash(originalPassword, 10, (err, hash) => {
      this.set("password", hash);
      // console.log("done");
      next();
    });
  });
};

/**
 * Hash password before updating document
 * @param schema
 */
export const preUpdateHashPassword = (schema: Schema) => {
  schema.pre("findOneAndUpdate", function(next) {
    // @ts-ignore
    const originalPassword = this.get("password");
    bcrypt.hash(originalPassword, 10, (err, hash) => {
      // @ts-ignore
      this._update.password = hash;
      this.update();
      next();
    });
  });
};

/**
 * Compares candidate password with final
 * @param schema
 */
export const comparePassword = (schema: Schema) => {
  schema.methods.comparePassword = function(
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
};
