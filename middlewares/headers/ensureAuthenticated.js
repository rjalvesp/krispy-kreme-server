const R = require("ramda");
const auth = require("../../services/auth");

module.exports = (req, res, next) => {
  const token = R.pipe(
    R.pathOr("bearer ", ["headers", "authorization"]),
    R.split(" "),
    R.prop(1)
  )(req);
  auth
    .getUser(token)
    .then(() => next())
    .catch((err) =>
      res
        .status(401)
        .json({ description: err, tag: "invalid_auth_header", code: "0.1.1.0" })
    );
};
