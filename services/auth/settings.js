const R = require("ramda");

module.exports = {
  userPoolId: R.path(["AWS_COGNITO_POOL_ID"], process.env),
  region: R.path(["AWS_REGION"], process.env),
  accessKeyId: R.path(["AWS_ACCESS_KEY_ID"], process.env),
  secretAccessKey: R.path(["AWS_SECRET_ACCESS_KEY"], process.env),
};
