/**
 * Common middleware in all server.ts
 */
import parser from "body-parser";
import compression from "compression";
import cors from "cors";
import { Router } from "express";

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
