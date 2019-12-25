/**
 * Http errors for different problems. Allows one to pass in messages when throwing errors
 * Example use: throw new HTTP400Error({message:'password is too short'})
 */

/**
 * Abstract HTTPClient Error, formats message for uyse by built in Error Object
 */
export abstract class HTTPClientError extends Error {
  public readonly statusCode!: number;
  public readonly name!: string;

  protected constructor(message: object | string) {
    // If a message exists, convert it into an object and set error as the message
    if (message instanceof Object) {
      super(JSON.stringify(message));
    } else {
      super(message);
    }
    this.name = this.constructor.name;
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Code
 */
export class HTTP400Error extends HTTPClientError {
  public readonly statusCode = 400;

  constructor(message: string | object = "Bad Request") {
    super(message);
  }
}

/**
 * 404 Code
 */
export class HTTP404Error extends HTTPClientError {
  public readonly statusCode = 404;

  constructor(message: string | object = "Not found") {
    super(message);
  }
}
