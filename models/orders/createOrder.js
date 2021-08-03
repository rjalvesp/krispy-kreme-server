const R = require("ramda");
const RA = require("ramda-adjunct");
const { QueryTypes } = require("sequelize");
const {
  db,
  getFields,
  getValues,
  getReplacements,
} = require("../../services/database");

const parseModifiers = (order_item_id) =>
  R.pipe(
    R.pluck("modifiers"),
    R.flatten,
    R.uniq,
    R.reject(R.isEmpty),
    R.map(
      R.pipe(
        R.objOf("item_modifier_id"),
        R.assoc("order_item_id", order_item_id)
      )
    )
  );

const saveOrderItemModifiers = (orderItems) => (order_item_id) => {
  const modifiers = parseModifiers(order_item_id)(orderItems);
  if (!modifiers.length) {
    return;
  }
  return db.query(
    `INSERT INTO \`order_item_modifiers\`${getFields(
      modifiers
    )} VALUES${getValues(modifiers)}`,
    {
      replacements: getReplacements(modifiers),
      type: QueryTypes.INSERT,
    }
  );
};

const saveOrderItems = (body, items) => {
  const { id: order_id } = body;
  const orderItems = R.map(
    R.pipe(R.assoc("order_id", order_id), RA.renameKeys({ id: "item_id" })),
    items
  );
  const storingItems = R.map(R.omit(["modifiers"]), orderItems);
  return db
    .query(
      `INSERT INTO \`order_items\`${getFields(storingItems)} VALUES${getValues(
        storingItems
      )}`,
      {
        replacements: getReplacements(storingItems),
        type: QueryTypes.INSERT,
      }
    )
    .then(R.prop(0))
    .then(saveOrderItemModifiers(orderItems));
};

module.exports = ({ items, ...body }) =>
  db
    .query(
      `INSERT INTO \`orders\`${getFields(body)} VALUES${getValues(body)}`,
      {
        replacements: getReplacements(body),
        type: QueryTypes.INSERT,
      }
    )
    .then(() => {
      if (!items.length) {
        return;
      }
      return saveOrderItems(body, items);
    });
