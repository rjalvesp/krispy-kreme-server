const R = require("ramda");
const { promisify } = require("util");
const { QueryTypes } = require("sequelize");
const { db } = require("../../services/database");
const logger = require("../../services/logger");

const getLogs = promisify(logger.lrange).bind(logger);

const defaultQuerySettings = {
  raw: true,
  nest: true,
  type: QueryTypes.SELECT,
};

const pickModifierIfNotEmpty = R.when(
  R.pipe(R.values, R.reject(R.isNil), R.isEmpty),
  R.always(null)
);

const query = `
  SELECT o.*, 
    p.name        AS provider,
    i.id          AS 'item.id', 
    i.name        AS 'item.name', 
    i.description AS 'item.description', 
    i.type        AS 'item.type', 
    i.price       AS 'item.price', 
    im.id         AS 'modifier.id',
    im.group      AS 'modifier.group',
    im.name       AS 'modifier.name',
    im.price      AS 'modifier.price'
  FROM orders AS o
    INNER JOIN providers AS p ON p.id = o.provider_id
    LEFT JOIN order_items AS oi ON o.id = oi.order_id
    LEFT JOIN items AS i ON i.id = oi.item_id
    LEFT JOIN order_item_modifiers AS oim ON oi.id = oim.order_item_id
    LEFT JOIN item_modifiers AS im ON im.id = oim.item_modifier_id
  WHERE o.id = ?;
`;

module.exports = (id) => {
  return db
    .query(query, {
      replacements: [id],
      ...defaultQuerySettings,
    })
    .then((orderValues) => ({
      ...orderValues[0],
      items: R.pipe(
        R.groupBy(R.path(["item", "id"])),
        R.values,
        R.map((itemValues) => ({
          ...itemValues[0].item,
          modifiers: R.pipe(
            R.map(R.pipe(R.propOr({}, "modifier"), pickModifierIfNotEmpty)),
            R.reject(R.isNil)
          )(itemValues),
        }))
      )(orderValues),
    }))
    .then((value) =>
      getLogs(`orders:${id}:logs`, 0, -1)
        .then(R.map(JSON.parse))
        .then((logs) => ({ ...value, logs }))
    )
    .then(R.omit(["item", "modifier"]));
};
