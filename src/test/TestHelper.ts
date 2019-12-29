import { cleanCollectionOfTestGbs } from "../models/gb";
import { cleanCollectionOfTestUsers } from "../models/user";
import { request } from "./common.spec";

export class TestHelper {
  private _testUser1 = { username: "test1", password: "test1" };
  private _testUser2 = { username: "test2", password: "test2" };
  private _loginRoute = "/auth/login";
  private _registerRoute = "/auth/register";
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

  constructor(loginRoute?: string, registerRoute?: string) {
    if (loginRoute) {
      this._loginRoute = loginRoute;
    }
    if (registerRoute) {
      this._registerRoute = registerRoute;
    }
  }

  public async initializeTestEnvironment(): Promise<any> {
    await cleanCollectionOfTestUsers();
    await cleanCollectionOfTestGbs();
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

export class GbHelper extends TestHelper {
  private _gbLoginRoute: string;
  private _gbRegisterRoute: string;
  private _gbAuthToken: string = "";
  private _gbId: string = "";

  get gbId(): string {
    return this._gbId;
  }

  get gbLoginRoute(): string {
    return this._gbLoginRoute;
  }

  get gbRegisterRoute(): string {
    return this._gbRegisterRoute;
  }

  get gbAuthToken(): string {
    return this._gbAuthToken;
  }

  constructor() {
    super();
    this._gbLoginRoute = "/gb/login";
    this._gbRegisterRoute = "/gb/create";
  }

  public async loginGb(
    parameters: LoginInformation,
    expectedResponse: number
  ): Promise<any> {
    return request
      .post(this._gbLoginRoute)
      .set("Authorization", this.authToken1)
      .send(parameters)
      .expect(expectedResponse)
      .then(v => {
        this._gbAuthToken = v.body.token;
        this._gbId = v.body.user;
      });
  }

  public async registerGb(
    parameters: LoginInformation,
    expectedResponse: number
  ): Promise<any> {
    return request
      .post(this._gbRegisterRoute)
      .set("Authorization", this.authToken1)
      .send(parameters)
      .expect(expectedResponse);
  }
}
