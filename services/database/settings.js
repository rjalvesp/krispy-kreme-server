const R = require("ramda");
const Path = require("path");
Promise.resolve(
  require("dotenv").config({
    allowEmptyValues: true,
    path: Path.resolve(process.cwd(), ".env"),
  })
);

module.exports = {
  default: {
    database: R.path(["env", "DB_NAME"], process),
    dialect: R.path(["env", "DB_DIALECT"], process),
    host: R.path(["env", "DB_HOST"], process),
    password: R.path(["env", "DB_PASSWORD"], process),
    port: parseInt(R.path(["env", "DB_PORT"], process), 10),
    username: R.path(["env", "DB_USER"], process),
  },
};
