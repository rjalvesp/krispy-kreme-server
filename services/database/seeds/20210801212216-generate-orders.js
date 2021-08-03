"use strict";

const moment = require("moment");
const R = require("ramda");
const RA = require("ramda-adjunct");
const { v4 } = require("uuid");
const { datatype, name, phone, random } = require("faker");
const {
  getRandomArrayElement,
  getReference,
} = require("../../../utils/randomizer");
const { PAYMENT_METHODS } = require("../../../utils/constants");
const { getSubtotal } = require("../../../utils/methods");

const getDate = (date, hour) => {
  return date
    .clone()
    .set("hour", hour)
    .set("minute", datatype.number({ min: 0, max: 60 }))
    .set("second", datatype.number({ min: 0, max: 60 }))
    .format("YYYY-MM-DD HH:mm:ss");
};

const couponsList = [];

for (let couponIdx = 0; couponIdx < 100; couponIdx++) {
  couponsList.push({ value: random.words(), percent: couponIdx / 100 });
}

const calculateOrderItems = (pickedItems) => {
  const couponSettings = datatype.number({ min: 0, max: 1 })
    ? getRandomArrayElement(couponsList)
    : { value: null, percent: 0 };
  const subTotal = getSubtotal(pickedItems);
  const discount = couponSettings.percent * subTotal;
  const iva = subTotal * 0.16;
  return {
    calcData: {
      coupon: couponSettings.value,
      sub_total: subTotal,
      discount,
      iva,
      total: subTotal - discount + iva,
    },
    pickedItems,
  };
};

const getOrderItems = (items, itemModifiers) => {
  const amountItems = datatype.number({ min: 1, max: 5 });
  const pickedItems = [];
  for (let amountIdx = 0; amountIdx < amountItems; amountIdx++) {
    const randomItemIdx = datatype.number({ min: 1, max: items.length - 1 });
    const item = items[randomItemIdx];
    const modifiers = [];
    const hasModifiers = datatype.number({ min: 0, max: 1 });
    if (hasModifiers) {
      const modifierGroupsByItem = R.propOr({}, item.id, itemModifiers);
      const modifierGroups = R.values(modifierGroupsByItem);
      for (let groupIdx = 0; groupIdx < modifierGroups.length; groupIdx++) {
        const hasThisGroupModifier = datatype.number({ min: 0, max: 1 });
        if (hasThisGroupModifier) {
          const modifierGroup = modifierGroups[groupIdx];
          const idx = datatype.number({
            min: 0,
            max: modifierGroup.length - 1,
          });
          modifiers.push(modifierGroup[idx]);
        }
      }
    }
    pickedItems.push({ ...item, modifiers });
  }
  return calculateOrderItems(pickedItems);
};

const fetchItems = (queryInterface) =>
  queryInterface.sequelize.query("SELECT * FROM items;").then(R.propOr([], 0));

const fetchProviders = (queryInterface) =>
  queryInterface.sequelize
    .query("SELECT id FROM providers;")
    .then(R.propOr([], 0))
    .then(R.pluck("id"));

const fetchItemModifiers = (queryInterface) =>
  queryInterface.sequelize
    .query("SELECT * FROM item_modifiers;")
    .then(R.propOr([], 0))
    .then(
      R.pipe(
        R.groupBy(R.prop("item_id")),
        R.mapObjIndexed(R.groupBy(R.prop("group")))
      )
    );

const fetchOrderIds = (queryInterface) =>
  queryInterface.sequelize
    .query("SELECT id FROM orders ORDER BY updated_at DESC;")
    .then(R.path([0]));

const fetchOrderItemIds = (queryInterface) =>
  queryInterface.sequelize
    .query("SELECT id FROM order_items ORDER BY id DESC;")
    .then(R.path([0]));

const generateOrder = (
  { items, itemModifiers, providers },
  initialDate,
  hour
) => {
  const created_at = getDate(initialDate.clone(), hour);
  const { pickedItems, calcData } = getOrderItems(items, itemModifiers);
  return {
    id: v4(),
    provider_id: getRandomArrayElement(providers),
    reference: getReference(),
    payment_method: getRandomArrayElement(PAYMENT_METHODS),
    payment_reference: v4(),
    created_at,
    client_name: name.findName(),
    client_phone: phone.phoneNumber(),
    deliverer_name: name.findName(),
    deliverer_phone: phone.phoneNumber(),
    ...calcData,
    items: pickedItems,
  };
};

const saveOrders = (queryInterface, overallOrders) =>
  queryInterface.bulkInsert(
    "orders",
    R.map(R.omit(["items"]), overallOrders),
    {}
  );

const saveOrderItems = async (queryInterface, overallOrders) => {
  const orders = await fetchOrderIds(queryInterface).then(R.pluck("id"));
  const orderItems = overallOrders.map(({ items: overallItems }, idx) =>
    overallItems.map(
      R.pipe(
        R.pick(["id", "modifiers"]),
        RA.renameKeys({ id: "item_id" }),
        R.assoc("order_id", orders[idx])
      )
    )
  );
  const overallOrderItems = R.flatten(orderItems);
  await queryInterface.bulkInsert(
    "order_items",
    R.map(R.omit(["modifiers"]), overallOrderItems),
    {}
  );
  return overallOrderItems;
};

const saveOrderItemModifiers = async (queryInterface, overallOrderItems) => {
  const orderItemIds = await fetchOrderItemIds(queryInterface).then(
    R.pluck("id")
  );

  const orderItemModifiers = overallOrderItems.map(
    ({ modifiers: overallModifiers }, idx) =>
      overallModifiers.map(
        R.pipe(
          R.pick(["id"]),
          RA.renameKeys({ id: "item_modifier_id" }),
          R.assoc("order_item_id", orderItemIds[idx])
        )
      )
  );
  const orderModifiers = R.pipe(
    R.flatten,
    R.groupBy(R.prop("item_modifier_id")),
    R.omit(["undefined"]),
    R.values,
    R.flatten
  )(orderItemModifiers);
  await queryInterface.bulkInsert("order_item_modifiers", orderModifiers, {});
};

const saveAllData = async (queryInterface, overallOrders) => {
  await saveOrders(queryInterface, overallOrders);
  const overallOrderItems = await saveOrderItems(queryInterface, overallOrders);
  await saveOrderItemModifiers(queryInterface, overallOrderItems);
};

const saveMonthData = async (
  { queryInterface, itemModifiers, items, providers },
  subtract
) => {
  const overallOrders = [];
  const initialDate = moment().subtract(subtract + 1, "month");
  const endDate = moment().subtract(subtract, "month");
  while (initialDate.isSameOrBefore(endDate)) {
    for (let hour = 0; hour < 24; hour++) {
      const ordersCount = datatype.number({
        min: 0,
        max: 100,
      });
      for (let orderIdx = 0; orderIdx < ordersCount; orderIdx++) {
        if (datatype.number({ min: 0, max: 100 }) < 80) {
          continue;
        }
        overallOrders.push(
          generateOrder(
            { queryInterface, itemModifiers, items, providers },
            initialDate,
            hour
          )
        );
      }
    }
    initialDate.add(1, "day");
  }
  await saveAllData(queryInterface, overallOrders);
};

module.exports = {
  up: async (queryInterface) => {
    const items = await fetchItems(queryInterface);
    const itemModifiers = await fetchItemModifiers(queryInterface);
    const providers = await fetchProviders(queryInterface);
    for (let idx = 12; idx > 0; idx--) {
      await saveMonthData(
        { queryInterface, items, itemModifiers, providers },
        idx
      );
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("order_item_modifiers", null, {});
    await queryInterface.bulkDelete("order_items", null, {});
    await queryInterface.bulkDelete("orders", null, {});
  },
};
