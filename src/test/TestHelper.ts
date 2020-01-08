import { cleanCollectionOfTestGbs } from "../models/gb";
import { cleanCollectionOfTestUsers } from "../models/user";
import { request } from "./common.spec";

export class TestHelper {
  private _testUser1 = { email: "test1", password: "test1" };
  private _testUser2 = { email: "test2", password: "test2" };
  private _loginRoute = "/auth/login";
  private _registerRoute = "/auth/register";
  private _authToken1: string = "";
  private _userId1: string = "";

  get testUser1(): { password: string; email: string } {
    return this._testUser1;
  }

  get testUser2(): { password: string; email: string } {
    return this._testUser2;
  }

  get loginRoute(): string {
    return this._loginRoute;
  }

  get authToken1(): string {
    return "Bearer " + this._authToken1;
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
    await cleanCollectionOfTestGbs();
    await this.register(this.testUser1, 201);
    await this.register(this.testUser2, 201);
  }

  public async login(
    parameters: UserLoginInformation,
    expectedResponse: number
  ): Promise<any> {
    return request
      .post(this._loginRoute)
      .send(parameters)
      .expect(expectedResponse);
  }

  public async register(
    parameters: UserLoginInformation,
    expectedResponse: number
  ): Promise<any> {
    return request
      .post(this._registerRoute)
      .send(parameters)
      .expect(expectedResponse);
  }
}

interface UserLoginInformation {
  email: string;
  password: string;
}
interface GbLoginInformation {
  username: string;
  password: string;
}

export class GbHelper extends TestHelper {
  private _gbLoginRoute: string;
  private _gbRegisterRoute: string;
  private _gbAuthToken: string = "";
  private _gbId: string = "";
  private _gbIdToDelete: string = "";

  set gbIdToDelete(value: string) {
    this._gbIdToDelete = value;
  }

  get gbIdToDelete(): string {
    return this._gbIdToDelete;
  }

  get gbId(): string {
    return this._gbId;
  }

  get gbLoginRoute(): string {
    return this._gbLoginRoute;
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
    parameters: GbLoginInformation,
    expectedResponse: number
  ): Promise<any> {
    return request
      .post(this._gbLoginRoute)
      .set("Authorization", this.authToken1)
      .send(parameters)
      .expect(expectedResponse)
      .then(v => {
        if (v.body.gb) {
          this._gbAuthToken = v.body.token;
          this._gbId = v.body.gb._id;
        }
      });
  }

  public async registerGb(
    parameters: GbLoginInformation,
    expectedResponse: number
  ): Promise<any> {
    return request
      .post(this._gbRegisterRoute)
      .set("Authorization", this.authToken1)
      .send(parameters)
      .expect(expectedResponse);
  }
}
