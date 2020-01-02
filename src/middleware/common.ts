/**
 * Common middleware in all server.ts
 */
import parser from "body-parser";
import compression from "compression";
import cors from "cors";
import { Router } from "express";
import { IUser } from "../models/user";
import auth from "../services/auth/auth";

const expressValidator = require("express-validator");

/**
 * Handle cors
 * @param router
 */
export const handleCors = (router: Router) =>
  router.use(cors({ credentials: true, origin: true }));

/**
 * Parse body into JSON
 * @param router
 */
export const handleBodyRequestParsing = (router: Router) => {
  router.use(parser.urlencoded({ extended: true }));
  router.use(parser.json());
};

/**
 * Use compression
 * @param router
 */
export const handleCompression = (router: Router) => {
  router.use(compression());
};

export const expressValidate = (router: Router) => {
  router.use(expressValidator());
};

/**
 * Checks for auth token on all routes except login and register
 */
export const checkAuth = (router: any) => {
  router.all("*", (req: any, res: any, next: any) => {
    if (
      req.path.includes("login") ||
      req.path.includes("register") ||
      req.path.includes("sign-out")
    ) {
      return next();
    }

    // console.log("headers loggin in", req.headers.authorization);

    return auth.authenticate((err: Error, user: IUser, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      router.set("user", user);
      return next();
    })(req, res, next);
  });
};
