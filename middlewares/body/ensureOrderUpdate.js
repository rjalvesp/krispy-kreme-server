const Joi = require("joi");
const R = require("ramda");

const schema = Joi.object({
  status: Joi.string().valid("ACCEPTED", "DECLINED", "CANCELLED"),
});

module.exports = (req, res, next) => {
  const body = R.propOr({}, "body", req);
  const errorBody = schema.validate(body).error;
  if (errorBody) {
    return res.status(400).json({
      description: errorBody,
      errorCode: "1.1.1.3",
      httpCode: 400,
      tag: "order_update_body_malformed",
    });
  }
  next();
};
