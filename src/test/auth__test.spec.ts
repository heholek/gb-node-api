import { login, request } from "./common.spec";

import { cleanCollection } from "../models/user";

process.env.API_BASE = "";

describe("# Auth", () => {
  const endpoint = "/auth/login";

  it("should retrieve the token", () => {
    return cleanCollection().then((res: any) => {
      return login().then((res1: any) => {
        res1.status.should.equal(200);
        // tslint:disable-next-line:no-unused-expression
        res1.body.token.should.not.be.empty;
      });
    });
  });

  it("should not login with the right user but wrong password", () => {
    return request
      .post(endpoint)
      .send({ username: "testuser", password: "anythingGoesHere" })
      .expect(401);
  });

  it("should return invalid credentials error", () => {
    return request
      .post(endpoint)
      .send({ username: "testuser", password: "" })
      .expect(401)
      .then((res: any) => {
        return request
          .post(endpoint)
          .send({ username: "anotherusername", password: "mypass" })
          .expect(401);
      });
  });
});
