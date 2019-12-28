import chai from "chai";
import "mocha";
import supertest from "supertest";
const app = require("../server");

export const request = supertest(app);
export const should = chai.should();
