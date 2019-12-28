/**
 * User login and signup routes
 */
import User from "../user/users";
import Auth from "./auth";

const root = "/auth";
export default [
  {
    root,
    path: "/login",
    method: "post",
    handler: Auth.login
  },
  {
    root,
    path: "/register",
    method: "post",
    handler: User.create
  }
];
