import { request } from "./common.spec";
import { TestHelper } from "./TestHelper";
const testHelper = new TestHelper();

describe("# Auth", () => {
  it("should retrieve the token and id", done => {
    testHelper.initializeTestEnvironment().then(() => {
      testHelper.login(testHelper.testUser1, 200).then((res1: any) => {
        // tslint:disable-next-line:no-unused-expression
        res1.body.token.should.not.be.empty;
        // tslint:disable-next-line:no-unused-expression
        res1.body.user.should.not.be.empty;
        testHelper.authToken1 = res1.body.token;
        testHelper.userId1 = res1.body.user;
        done();
      });
    });
  });

  it("should not login with the right user but wrong password", () => {
    return testHelper.login(
      { username: testHelper.testUser1.username, password: "wrongpassword" },
      401
    );
  });

  it("should return invalid credentials error if no password or a nonexistant username is sent", () => {
    return testHelper
      .login({ username: testHelper.testUser1.username, password: "" }, 401)
      .then(res => {
        return testHelper.login(
          { username: "anotherusername", password: "fakepass" },
          401
        );
      });
  });

  it("should create user", () => {
    return testHelper.register(
      { username: "test " + Date.now().toString(), password: "test" },
      201
    );
  });

  it("should not create user without password", () => {
    return testHelper.register(
      { username: "test " + Date.now().toString(), password: "" },
      400
    );
  });

  it("should not allow accessing user list without token", () => {
    return request.put(`/user`).expect(401); // Unauthorized
  });

  it("should not allow login without information in the body", () => {
    return request.post(testHelper.loginRoute).expect(401);
  });

  it("should get user information", () => {
    return request
      .get("/user")
      .set("Authorization", testHelper.authToken1)
      .expect(200);
  });

  it("should error out if a non valid id is passed in", () => {
    return request
      .get(`/user/123213898539258`)
      .set("Authorization", testHelper.authToken1)
      .expect(400);
  });

  it("should error out if a user doesnt exist for id", () => {
    return request
      .get(`/user/5e05753ab6da9e7d0cb5c0ab`)
      .set("Authorization", testHelper.authToken1)
      .expect(404);
  });

  it("should get a single user based on their id", () => {
    return request
      .get(`/user/${testHelper.userId1}`)
      .set("Authorization", testHelper.authToken1)
      .expect(200);
  });

  it("should not allow two users with the same username", () => {
    return testHelper.register(testHelper.testUser1, 400).then((res: any) => {
      // tslint:disable-next-line:no-unused-expression
      res.body.message.should.equal("Error: Username Taken");
    });
  });

  it("should update user", () => {
    return request
      .put(`/user/${testHelper.userId1}`)
      .set("Authorization", testHelper.authToken1)
      .send({ username: "test1", password: "test1" })
      .expect(200)
      .then((res: any) => {
        return request
          .post(testHelper.loginRoute)
          .send({ username: "test1", password: "test1" })
          .expect(200);
      });
  });
});
