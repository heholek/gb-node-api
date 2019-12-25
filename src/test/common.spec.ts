process.env.NODE_ENV = "test";
process.env.API_BASE = "";

import chai from "chai";
import "mocha";
import supertest from "supertest";

import { IUser, model as User } from "../models/user";

const app = require("../server");

export const request = supertest(app);
export const should = chai.should();

const testUser = { username: "testuser", password: "mytestpass" };

const createUser = async (): Promise<void> => {
  const UserModel = new User(testUser);
  await UserModel.save();
};

const getUser = async (): Promise<IUser> => {
  const users = await User.find({});
  if (users.length === 0) {
    await createUser();
    return getUser();
  } else {
    return users[0];
  }
};

export const login = async (): Promise<any> => {
  const user = await getUser();
  return request
    .post("/auth/login")
    .send({ username: user.username, password: testUser.password })
    .expect(200);
};
