import { cleanCollectionOfTestUsers } from "../models/user";
import { request } from "./common.spec";

export class TestHelper {
  private _testUser1 = { username: "test1", password: "test1" };
  private _testUser2 = { username: "test2", password: "test2" };
  private _loginRoute = "/auth/login";
  private _registerRoute = "/auth/register";
  private _userRoute = "/user";
  private _authToken1: string = "";
  private _userId1: string = "";

  get testUser1(): { password: string; username: string } {
    return this._testUser1;
  }
  set testUser1(value: { password: string; username: string }) {
    this._testUser1 = value;
  }
  get testUser2(): { password: string; username: string } {
    return this._testUser2;
  }
  set testUser2(value: { password: string; username: string }) {
    this._testUser2 = value;
  }
  get loginRoute(): string {
    return this._loginRoute;
  }

  get authToken1(): string {
    return this._authToken1;
  }
  set authToken1(value: string) {
    this._authToken1 = value;
  }
  get userId1(): string {
    return this._userId1;
  }
  set userId1(value: string) {
    this._userId1 = value;
  }

  public async initializeTestEnvironment(): Promise<any> {
    await cleanCollectionOfTestUsers();
    await this.register(this.testUser1, 201);
    await this.register(this.testUser2, 201);
  }

  public async login(
    parameters: LoginInformation,
    expectedResponse: number
  ): Promise<any> {
    return request
      .post(this._loginRoute)
      .send(parameters)
      .expect(expectedResponse);
  }

  public async register(
    parameters: LoginInformation,
    expectedResponse: number
  ): Promise<any> {
    return request
      .post(this._registerRoute)
      .send(parameters)
      .expect(expectedResponse);
  }
}

interface LoginInformation {
  username: string;
  password: string;
}
