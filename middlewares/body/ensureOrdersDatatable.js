const Joi = require("joi");
const R = require("ramda");

const schema = Joi.object({
  limit: Joi.number().integer().required(),
  offset: Joi.number().integer().required(),
  sortingField: Joi.string().valid(
    "created_at",
    "status",
    "provider",
    "reference",
    "sub_total",
    "total",
    "coupon",
    "payment_method"
  ),
  sortingDirection: Joi.string().valid("ASC", "DESC"),
  filtering: Joi.object({
    id: Joi.number(),
    columnField: Joi.string()
      .required()
      .valid(
        "created_at",
        "status",
        "provider",
        "reference",
        "sub_total",
        "total",
        "coupon",
        "payment_method"
      ),
    operatorValue: Joi.string()
      .required()
      .valid("startsWith", "endsWith", "contains"),
    value: Joi.string().required(),
  }).optional(),
});

const getComparer = (operatorValue) =>
  operatorValue === "equals" ? " = " : " LIKE ";

const getValue = (operatorValue, value) => {
  switch (operatorValue) {
    case "startsWith": {
      return `${value.toLowerCase()}%`;
    }
    case "endsWith": {
      return `%${value.toLowerCase()}`;
    }
    case "equals": {
      return `${value.toLowerCase()}`;
    }
    default: {
      return `%${value.toLowerCase()}%`;
    }
  }
};

const fieldMapper = { provider: ["p.name"] };

const getQuery = ({ columnField, operatorValue, value }) => ({
  field: columnField,
  query: ` ${getComparer(operatorValue)} ?`,
  value: value ? [getValue(operatorValue, value)] : [],
});

const setField = (query) =>
  R.pipe(
    R.when(() => R.has(R.__, fieldMapper), R.prop(R.__, fieldMapper)),
    R.append(query),
    R.join("")
  );

module.exports = (req, res, next) => {
  const body = R.propOr({}, "body", req);
  const errorBody = schema.validate(body).error;
  if (errorBody) {
    return res.status(400).json({
      description: errorBody,
      errorCode: "1.1.1.3",
      httpCode: 400,
      tag: "order_search_malformed",
    });
  }
  if (body.filtering && Object.keys(body.filtering).length) {
    req.body = R.over(
      R.lensProp("filtering"),
      R.pipe(getQuery, (value) =>
        R.zipObj(
          ["filterQuery", "filterValue"],
          [setField(value.query)(value.field), value.value]
        )
      )
    )(body);
  }
  next();
};
