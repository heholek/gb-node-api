import { expect } from "chai";
import config from "config";
import io from "socket.io-client";
import { model as Gb } from "../models/gb";
import Gbs from "../services/gb/gb";
import { initializeSockets, server } from "../utils/sockets";

// Create GB and take ID

let id: string;

const Data = new Gb({
  username: "gb2",
  password: "gb"
});

describe("# Socket", () => {
  before(done => {
    Data.save().then(v => {
      id = v._id;
      initializeSockets().then(a => {
        done();
      });
    });
  });

  it("should not allow users to connect without proper authorization", done => {
    const socket = io.connect(
      `http://localhost:${config.get("socketPort")}/${id}`
    );
    // tslint:disable-next-line:no-unused-expression
    socket.on("error", (err: any) => {
      expect(err).to.equal("Authentication Error");
      done();
    });
  });

  it("should let users connect that have the proper authorization", done => {
    const socket = io.connect(
      `http://localhost:${config.get("socketPort")}/${id}`,
      {
        query: { username: "gb2", password: "gb" }
      }
    );
    // tslint:disable-next-line:no-unused-expression
    return socket.on("connect", (msg: any) => {
      // tslint:disable-next-line:no-unused-expression
      expect(socket.connected).to.be.true;
      done();
    });
  });

  it("should get messages from a socket to namespace gb1 on topic test", done => {
    const socket = io
      .connect(`http://localhost:${config.get("socketPort")}/${id}`, {
        query: { username: "gb2", password: "gb" }
      })
      .emit("test", "test");

    server.of(`${id}`).on("connection", s => {
      s.on("test", message => {
        expect(message).to.be.equal("test");
        done();
      });
    });
  });
});
