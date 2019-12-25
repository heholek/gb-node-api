import { login, request } from "./common.spec";

import { cleanCollection } from "../models/user";
describe("# Auth", () => {
  const loginEndpoint = "/auth/login";

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
      .post(loginEndpoint)
      .send({ username: "testuser", password: "anythingGoesHere" })
      .expect(401);
  });

  it("should return invalid credentials error", () => {
    return request
      .post(loginEndpoint)
      .send({ username: "testuser", password: "" })
      .expect(401)
      .then((res: any) => {
        return request
          .post(loginEndpoint)
          .send({ username: "anotherusername", password: "mypass" })
          .expect(401);
      });
  });

  it("should create user", () => {
    return request
      .post("/auth/register")
      .send({ username: Date.now().toString(), password: "test" })
      .expect(201);
  });
});
