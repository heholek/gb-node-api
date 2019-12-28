import { cleanCollectionOfTestUsers, model as User } from "../models/user";
import { request } from "./common.spec";

export class TestHelper {
  private _testUser1 = { username: "test1", password: "test1" };
  private _testUser2 = { username: "test2", password: "test2" };
  private _loginRoute = "/auth/login";
  private _registerRoute = "/auth/register";
  private _userRoute = "/user";
  private _authToken1: string = "";
  private _userId1: string = "";
  get registerRoute(): string {
    return this._registerRoute;
  }
  set registerRoute(value: string) {
    this._registerRoute = value;
  }
  get userRoute(): string {
    return this._userRoute;
  }
  set userRoute(value: string) {
    this._userRoute = value;
  }
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
  set loginRoute(value: string) {
    this._loginRoute = value;
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

  /**
   * Creates a new user, either test1 or test2 baed on id
   * @param {number} id
   */
  public async createUser(userModel: LoginInformation): Promise<void> {
    const UserModel = new User(userModel);
    await UserModel.save();
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
