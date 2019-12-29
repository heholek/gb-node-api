import { request } from "./common.spec";
import { GbHelper } from "./TestHelper";
const gbHelper = new GbHelper();

describe("# Gb", () => {
  it("should retrieve the user token and id", done => {
    gbHelper.initializeTestEnvironment().then(() => {
      gbHelper.login(gbHelper.testUser1, 200).then((res1: any) => {
        // tslint:disable-next-line:no-unused-expression
        res1.body.token.should.not.be.empty;
        // tslint:disable-next-line:no-unused-expression
        res1.body.user.should.not.be.empty;
        gbHelper.authToken1 = res1.body.token;
        done();
      });
    });
  });

  it("should create a new gb", () => {
    return gbHelper.registerGb({ username: "gb1", password: "gb" }, 201);
  });

  it("should not allow two gbs with the same username", () => {
    return gbHelper.registerGb({ username: "gb1", password: "gb" }, 400);
  });

  it("should not create gb without password", () => {
    return gbHelper.registerGb({ username: "gb", password: "" }, 400);
  });

  it("should not allow logging in without body information", () => {
    return request.post(gbHelper.gbLoginRoute).expect(401);
  });

  it("should not login with nonexistant username", () => {
    return gbHelper.loginGb({ username: "wrong", password: "gb" }, 401);
  });

  it("should not login with wrong password", () => {
    return gbHelper.loginGb({ username: "gb1", password: "wrong" }, 401);
  });

  it("should login as gb", () => {
    return gbHelper.loginGb({ username: "gb1", password: "gb" }, 200);
  });

  it("should not edit gb without token", () => {
    return request.get("/gb").expect(401);
  });

  it("should get a single gb with a token", () => {
    return request
      .get(`/gb/${gbHelper.gbId}`)
      .set("Authorization", gbHelper.authToken1)
      .send({ gb_auth: gbHelper.gbAuthToken })
      .expect(200);
  });

  it("should get all gb with a token", () => {
    return request
      .get("/gb")
      .set("Authorization", gbHelper.authToken1)
      .send({ gb_auth: gbHelper.gbAuthToken })
      .expect(200);
  });

  it("should edit a gb with a token", done => {
    request
      .put(`/gb/${gbHelper.gbId}`)
      .set("Authorization", gbHelper.authToken1)
      .send({ username: "gb2", password: "gb", gb_auth: gbHelper.gbAuthToken })
      .expect(200)
      .then((res: any) => {
        request
          .get(`/gb/${gbHelper.gbId}`)
          .set("Authorization", gbHelper.authToken1)
          .send({ gb_auth: gbHelper.gbAuthToken })
          .expect(200)
          .then((res1: any) => {
            res1.body.username.should.equal("gb2");
            done();
          });
      });
  });

  it("shouldn't allow updating if gb already has name", done => {
    gbHelper
      .registerGb({ username: "nametaken", password: "gb" }, 201)
      .then(() => {
        request
          .put(`/gb/${gbHelper.gbId}`)
          .set("Authorization", gbHelper.authToken1)
          .send({
            username: "nametaken",
            password: "gb",
            gb_auth: gbHelper.gbAuthToken
          })
          .expect(400)
          .then((res: any) => {
            res.body.message.should.equal("Error: Username Taken");
            done();
          });
      });
  });

  it("shouldn't allow updating with incomplete data", () => {
    return request
      .put(`/gb/${gbHelper.gbId}`)
      .set("Authorization", gbHelper.authToken1)
      .send({ password: "gb", gb_auth: gbHelper.gbAuthToken })
      .expect(400);
  });

  it("should error out if a non valid id is passed in", () => {
    return request
      .get(`/user/123213898539258`)
      .set("Authorization", gbHelper.authToken1)
      .send({ gb_auth: gbHelper.gbAuthToken })
      .expect(400);
  });

  it("should error out if a user doesnt exist for id", () => {
    return request
      .get(`/user/5e05753ab6da9e7d0cb5c0ab`)
      .set("Authorization", gbHelper.authToken1)
      .send({ gb_auth: gbHelper.gbAuthToken })
      .expect(404);
  });

  it("should delete the byte", () => {
    return request
      .del(`/gb/${gbHelper.gbId}`)
      .set("Authorization", gbHelper.authToken1)
      .send({ password: "gb", gb_auth: gbHelper.gbAuthToken })
      .expect(200);
  });

  it("should error when deleting if byte not found", () => {
    return request
      .del(`/gb/53aa6da9e7d0cb5c0ab`)
      .set("Authorization", gbHelper.authToken1)
      .send({ gb_auth: gbHelper.gbAuthToken })
      .expect(400);
  });
});
