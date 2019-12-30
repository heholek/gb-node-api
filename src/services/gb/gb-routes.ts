const root = "/gb";
import Gb from "./gb";

export default [
  {
    root,
    path: "/login",
    method: "post",
    handler: Gb.login
  },
  {
    root,
    path: "/create",
    method: "post",
    handler: Gb.create
  },
  {
    root,
    path: "",
    method: "get",
    handler: Gb.getAll
  },
  {
    root,
    path: "/:id",
    method: "get",
    handler: Gb.getOne
  },
  {
    root,
    path: "/:id",
    method: "put",
    handler: Gb.update
  },
  {
    root,
    path: "/:id",
    method: "delete",
    handler: Gb.delete
  }
];
