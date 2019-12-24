const root = "/user";
export default [
  {
    root,
    path: "/test",
    method: "get",
    handler: async (req: any, res: any) => {
      res.send("Test");
    }
  }
];
