const R = require("ramda");

const indexResponse = R.pipe(
  R.indexBy(R.prop("name")),
  R.mapObjIndexed(R.prop("id"))
);

module.exports = {
  indexResponse,
};
