const R = require("ramda");

const getSubtotal = R.pipe(
  R.map(
    R.pipe(
      R.over(
        R.lensProp("modifiers"),
        R.pipe(
          R.map(R.pipe(R.propOr(0, "price"), R.when(R.isNil, R.always(0)))),
          R.sum
        )
      ),
      R.pick(["price", "modifiers"]),
      R.values,
      R.sum
    )
  ),
  R.sum
);

module.exports = {
  getSubtotal,
};
