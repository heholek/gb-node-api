import Auth from "./auth";

const root = "/auth";
export default [
  {
    root,
    path: "/login",
    method: "post",
    handler: Auth.login
  }
];
