const root = "/user";
import User from "./users";

export default [
  {
    root,
    path: "",
    method: "get",
    handler: User.getAll
  },
  {
    root,
    path: "/gbs",
    method: "get",
    handler: User.getOwnedGbs
  },
  {
    root,
    path: "/:id",
    method: "get",
    handler: User.getOne
  },
  {
    root,
    path: "/:id",
    method: "put",
    handler: User.update
  },
  {
    root,
    path: "/:id",
    method: "delete",
    handler: User.delete
  },
  {
    root,
    path: "/current",
    method: "get",
    handler: User.getCurrent
  }
];
