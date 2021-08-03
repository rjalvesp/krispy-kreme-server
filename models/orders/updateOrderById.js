const moment = require("moment");
const { QueryTypes } = require("sequelize");
const { db } = require("../../services/database");
const logger = require("../../services/logger");
const getOrderById = require("./getOrderById");

const defaultQuerySettings = {
  raw: true,
  type: QueryTypes.UPDATE,
};

module.exports = ({ id, status }) => {
  return db
    .query(
      `
      UPDATE orders
      SET orders.status = ? 
      WHERE orders.id = ?;
    `,
      {
        replacements: [status, id],
        ...defaultQuerySettings,
      }
    )
    .then(() =>
      logger.lpush(
        `orders:${id}:logs`,
        JSON.stringify({ status, timestamp: moment().format() })
      )
    )
    .then(() => getOrderById(id));
};
