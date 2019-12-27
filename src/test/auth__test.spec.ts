import { login, request } from "./common.spec";

import { cleanCollectionOfTestUsers } from "../models/user";
describe("# Auth", () => {
  const loginEndpoint = "/auth/login";
  let userId = "";
  let authToken = "";

  it("should retrieve the token and id", () => {
    return cleanCollectionOfTestUsers().then((res: any) => {
      return login().then((res1: any) => {
        res1.status.should.equal(200);
        // tslint:disable-next-line:no-unused-expression
        res1.body.token.should.not.be.empty;
        // tslint:disable-next-line:no-unused-expression
        res1.body.user.should.not.be.empty;
        authToken = res1.body.token;
        userId = res1.body.user;
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
      .send({ username: "test " + Date.now().toString(), password: "test" })
      .expect(201);
  });

  it("should not create user without password", () => {
    return request
      .post("/auth/register")
      .send({ username: "test " + Date.now().toString() })
      .expect(400);
  });

  it("should not allow accessing user list without token", () => {
    return request
      .put(`/user/${userId}`)
      .send({ username: "testuser", password: "test1" })
      .expect(401); // Unauthorized
  });

  it("should not allow auth requests without information in the body", () => {
    return request.post(loginEndpoint).expect(401);
  });

  it("should get user information", () => {
    return request
      .get("/user")
      .set("Authorization", authToken)
      .expect(200);
  });

  it("should get a single user based on their id", () => {
    return request
      .get(`/user/${userId}`)
      .set("Authorization", authToken)
      .expect(200);
  });

  it("should not allow two users with the same username", () => {
    request
      .post("/auth/register")
      .send({ username: "testuser", password: "test" });
    return request
      .post("/auth/register")
      .send({ username: "testuser", password: "test" })
      .expect(400)
      .then((res: any) => {
        // tslint:disable-next-line:no-unused-expression
        res.body.message.should.equal("Error: Username Taken");
      });
  });

  it("should update user", () => {
    return login().then((res1: any) => {
      authToken = res1.body.token;
      userId = res1.body.user;
      return request
        .put(`/user/${userId}`)
        .set("Authorization", authToken)
        .send({ username: "test1", password: "test1" })
        .expect(200)
        .then((res: any) => {
          return request
            .post(loginEndpoint)
            .send({ username: "test1", password: "test1" })
            .expect(200);
        });
    });

    // .then((res: any) => {
    //     request
    //       .post(loginEndpoint)
    //       .send({ username: "test1", password: "test1" })
    //       .then((res1: any) => {
    //         authToken = res1.body.token
    //       })

    // });
  });
});
