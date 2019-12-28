import { expect } from "chai";
import io from "socket.io-client";
import { server } from "../utils/sockets";

describe("# Socket", () => {
  it("should not allow users to connect without proper authorization", done => {
    const socket = io.connect("http://localhost:8000/gb1");
    // tslint:disable-next-line:no-unused-expression
    socket.on("error", (err: any) => {
      console.log(err);
      expect(err).to.equal("Authentication Error");
      done();
    });
  });

  it("should let users connect that have the proper authorization", done => {
    const socket = io.connect("http://localhost:8000/gb1", {
      query: { username: "test1", password: "test1" }
    });
    // tslint:disable-next-line:no-unused-expression
    return socket.on("connect", (msg: any) => {
      // tslint:disable-next-line:no-unused-expression
      expect(socket.connected).to.be.true;
      done();
    });
  });

  it("should get messages from a socket to namespace gb1 on topic test", done => {
    const socket = io
      .connect("http://localhost:8000/gb1", {
        query: { username: "test1", password: "test1" }
      })
      .emit("test", "test");

    server.of("/gb1").on("connection", s => {
      s.on("test", message => {
        expect(message).to.be.equal("test");
        done();
      });
    });
  });
});
