const R = require("ramda");

const isPositiveNumber = R.both(R.is(Number), R.gte(R.__, 0));

module.exports = {
  maybeParseInt: (path) =>
    R.over(
      R.lensPath(path),
      R.pipe(
        (value) => parseInt(value, 10),
        R.unless(isPositiveNumber, R.always(-1))
      )
    ),
};
