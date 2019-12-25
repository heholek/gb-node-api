/**
 * Middleware for error handling, uses ErrorHandler module
 */

import { NextFunction, Request, Response, Router } from "express";
import * as ErrorHandler from "../utils/ErrorHandler";

/**
 * 404 error
 * @param router
 */
const handle404Error = (router: Router) => {
  router.use((req: Request, res: Response) => {
    ErrorHandler.notFoundError();
  });
};

/**
 * Client errors such as bad request or unathorized
 * @param router
 */
const handleClientError = (router: Router) => {
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    ErrorHandler.clientError(err, res, next);
  });
};

/**
 * Internal Server Error
 * @param router
 */
const handleServerError = (router: Router) => {
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    ErrorHandler.serverError(err, res, next);
  });
};

export default [handle404Error, handleClientError, handleServerError];
