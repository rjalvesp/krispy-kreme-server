const R = require("ramda");
const Path = require("path");
Promise.resolve(
  require("dotenv").config({
    allowEmptyValues: true,
    path: Path.resolve(process.cwd(), ".env"),
  })
);

module.exports = {
  // db: R.path(["env", "REDIS_NAME"], process),
  host: R.path(["env", "REDIS_HOST"], process),
  port: parseInt(R.path(["env", "REDIS_PORT"], process), 10),
  password: R.path(["env", "REDIS_PASSWORD"], process),
};
