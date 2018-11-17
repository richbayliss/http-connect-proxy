import * as http from "http";
import * as net from "net";

export const createServer = () => {
  return http.createServer((req, resp) => {
    if (req.method !== "CONNECT") {
      resp.statusCode = 405;
      resp.end("Not Supported");
      return;
    }

    const [host, port] = (req.url || "").split(":", 3);
    const client = req.socket;
    const backend = net.createConnection(parseInt(port), host, () => {
      backend.on("data", data => {
        client.write(data);
      });

      backend.on("close", () => {
        resp.end();
      });

      client.on("data", data => {
        backend.write(data);
      });

      client.on("close", () => {
        backend.end();
      });
    });
  });
};
