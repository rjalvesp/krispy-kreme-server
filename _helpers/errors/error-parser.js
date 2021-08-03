const logger = require("../../services/logger");
const isDatabaseError = require("./isDatabaseError");
const R = require("ramda");

const outResponse = (label, context, happenIn) => ({
  ...happenIn,
  context: context,
  errorCode: `${label}.${happenIn.errorCode}`,
});

const preProccess = error => R.when(
  R.pipe(R.pathOr("", ["code"]), R.equals("ECONNREFUSED")),
  R.assoc("name", R.path(["code"], error))
)(error);

module.exports = (label) => (err) => {
  logger.error(err);
  err = preProccess(err);

  const happenedInDatabase = isDatabaseError(err);

  if (happenedInDatabase) {
    return outResponse(label, "DataBase Error.", happenedInDatabase);
  }

  return { error: "System hiccup!", errorCode: "UNKNOW.ERROR" };
};
