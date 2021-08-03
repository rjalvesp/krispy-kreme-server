const R = require("ramda");
const { QueryTypes } = require("sequelize");
const { db } = require("../../services/database");

const defaultQuerySettings = {
  raw: true,
  plain: true,
  type: QueryTypes.SELECT,
};

module.exports = (options) => {
  const {
    sortingField = "created_at",
    sortingDirection = "DESC",
    filtering: { filterValue = [], filterQuery } = {},
  } = options;
  return db
    .query(
      `
        SELECT count(*) as count
        FROM orders AS o
        INNER JOIN providers AS p ON o.provider_id = p.id
        ${filterQuery ? `WHERE ${filterQuery}` : ""}
        ORDER BY ${sortingField} ${sortingDirection}
      `,
      {
        replacements: [...filterValue],
        ...defaultQuerySettings,
      }
    )
    .then(R.propOr(0, "count"))
    .then((value) => parseInt(value, 10));
};
