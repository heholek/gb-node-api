import chai from "chai";
import "mocha";
import supertest from "supertest";
import { cleanCollectionOfTestUsers, model as User } from "../models/user";
const app = require("../server");

export const request = supertest(app);
export const should = chai.should();
