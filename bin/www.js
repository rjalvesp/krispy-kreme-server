const path = require("path");

require("dotenv-safe").config({
  allowEmptyValues: true,
  path: path.resolve(__dirname, "../.env"),
});

const http = require("http");
const R = require("ramda");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

const app = require("../app");
const debug = require("debug")("be-template:server");

const normalizePort = (val) => {
  const portValue = parseInt(val, 10);

  if (isNaN(portValue)) {
    return val;
  }

  if (portValue >= 0) {
    return portValue;
  }

  return false;
};

const onError = (port) => {
  return (error) => {
    if (error.syscall !== "listen") {
      throw error;
    }

    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  };
};

const onListening = (server) => {
  return () => {
    const addr = server.address();
    const bind =
      typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + bind);
  };
};

const boot = () => {
  const port = normalizePort(process.env.NODE_PORT || "3001");
  app.set("port", port);

  const server = http.createServer(app);

  server.listen(port);
  server.on("error", onError(port));
  server.on("listening", onListening(server));

  console.info(`Worker ${process.pid} started`);
};

if (cluster.isMaster && !R.includes(process.env.NODE_ENV, ["", "LOCAL"])) {
  console.info(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.info(`worker ${worker.process.pid} died`);
  });
} else {
  boot();
}
