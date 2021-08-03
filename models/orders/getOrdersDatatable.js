const R = require("ramda");
const { QueryTypes } = require("sequelize");
const { db } = require("../../services/database");
const paginationHelper = require("../_helpers/pagination");
const countOrders = require("./countOrders");

const defaultQuerySettings = {
  raw: true,
  type: QueryTypes.SELECT,
};

module.exports = (options) => {
  const {
    offset,
    limit,
    sortingField = "created_at",
    sortingDirection = "DESC",
    filtering: { filterValue = [], filterQuery } = {},
  } = options;
  return db
    .query(
      `
        SELECT o.*, p.name AS provider
        FROM orders AS o
        INNER JOIN providers AS p ON o.provider_id = p.id
        ${filterQuery ? `WHERE ${filterQuery}` : ""}
        ORDER BY ${sortingField} ${sortingDirection}
        LIMIT ? OFFSET ?;
      `,
      {
        replacements: [...filterValue, limit, offset],
        ...defaultQuerySettings,
      }
    )
    .then((data) =>
      countOrders(options)
        .then(R.objOf("total"))
        .then(R.assoc("data", data))
        .then(paginationHelper({ offset, limit }))
    );
};
