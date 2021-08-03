const R = require("ramda");
const { snakeCase } = require("change-case");
const { Sequelize } = require("sequelize");

const {
  default: { database, dialect, host, password, username },
} = require("./settings");

const getObjectFields = R.pipe(
  R.keys,
  R.map(snakeCase),
  R.join("`,`"),
  (value) => `(\`${value}\`)`
);

const getFields = R.ifElse(
  R.is(Array),
  R.pipe(R.prop(0), getObjectFields),
  getObjectFields
);

const getObjectValues = R.pipe(
  R.values,
  R.map(R.always("?")),
  R.join(","),
  (value) => `(${value})`
);

const getArrayObjectValues = R.pipe(R.map(getObjectValues), R.join(","));

const getValues = R.ifElse(R.is(Array), getArrayObjectValues, getObjectValues);

const getReplacements = R.ifElse(
  R.is(Array),
  R.pipe(R.map(R.values), R.flatten),
  R.values
);

module.exports = {
  db: new Sequelize(database, username, password, { dialect, host }),
  getValues,
  getFields,
  getReplacements,
};
