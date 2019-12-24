import User from "./users";

const root = "/auth";
export default [
  {
    root,
    path: "/register",
    method: "post",
    handler: User.create
  }
];
