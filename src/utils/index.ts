/**
 * Main util functions
 */
import { NextFunction, Request, Response, Router } from "express";

type Wrapper = (router: Router) => void;

/**
 * Apply all middleware to server
 * @param middleware
 * @param router
 */
export const applyMiddleware = (middleware: Wrapper[], router: Router) => {
  for (const f of middleware) {
    f(router);
  }
};

type Handler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

/**
 * Defines type for the Route
 */
interface Route {
  root: string;
  path: string;
  method: string;
  handler: Handler | Handler[];
}

/**
 * Apply all routes to server. Iterates through a given list of routes and applies them
 * @param routes - Array of routes applied
 * @param router - Router object
 */
export const applyRoutes = (routes: Route[], router: Router) => {
  for (const route of routes) {
    const { method, path, handler, root } = route;
    (router as any)[method](root + path, handler);
  }
};
