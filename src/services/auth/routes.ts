import { Request, Response } from "express";

const root = "/auth";
export default [
  {
    root,
    path: "",
    method: "get",
    handler: async (req: Request, res: Response) => {
      res.send("Hello world!");
    }
  }
];
