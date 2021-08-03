const path = require("path");

require("dotenv-safe").config({
  allowEmptyValues: true,
  path: path.resolve(__dirname, "../.env"),
});

const R = require("ramda");
const { v4 } = require("uuid");
const { datatype, name, phone, random } = require("faker");
const CronJob = require("cron").CronJob;

const { db } = require("../services/database");
const createOrder = require("../models/orders/createOrder");
const { getReference, getRandomArrayElement } = require("../utils/randomizer");
const { PAYMENT_METHODS } = require("../utils/constants");
const { getSubtotal } = require("../utils/methods");

const fetchItems = () => db.query("SELECT * FROM items;").then(R.propOr([], 0));

const fetchProviders = () =>
  db
    .query("SELECT id FROM providers;")
    .then(R.propOr([], 0))
    .then(R.pluck("id"));

const fetchItemModifiers = () =>
  db
    .query("SELECT * FROM item_modifiers;")
    .then(R.propOr([], 0))
    .then(
      R.pipe(
        R.groupBy(R.prop("item_id")),
        R.mapObjIndexed(R.groupBy(R.prop("group")))
      )
    );

const getRandomCoupon = () => ({
  name: random.words(),
  percent: datatype.number({ min: 0, max: 99 }) / 100,
});

const getOrderItems = (items, itemModifiers) => {
  const amountItems = datatype.number({ min: 1, max: 10 });
  const pickedItems = [];
  for (let amountIdx = 0; amountIdx < amountItems; amountIdx++) {
    if (datatype.number({ min: 0, max: 100 }) < 50) {
      continue;
    }
    const randomItemIdx = datatype.number({ min: 1, max: items.length - 1 });
    const item = R.pipe(R.prop(randomItemIdx), R.pick(["id"]))(items);
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
          modifiers.push(modifierGroup[idx].id);
        }
      }
    }
    pickedItems.push({ ...item, modifiers });
  }
  return pickedItems;
};

const calculateOrderItems = (pickedItems) => {
  const couponSettings = datatype.number({ min: 0, max: 1 })
    ? getRandomCoupon()
    : { value: null, percent: 0 };
  const subTotal = getSubtotal(pickedItems);
  const discount = couponSettings.percent * subTotal;
  const iva = subTotal * 0.16;
  return {
    coupon: couponSettings.value,
    sub_total: subTotal,
    discount,
    iva,
    total: subTotal - discount + iva,
  };
};

const generateOrder = ({ itemModifiers, items, providers }) => {
  const pickedItems = getOrderItems(items, itemModifiers);
  createOrder({
    id: v4(),
    provider_id: getRandomArrayElement(providers),
    reference: getReference(),
    payment_method: getRandomArrayElement(PAYMENT_METHODS),
    payment_reference: v4(),
    client_name: name.findName(),
    client_phone: phone.phoneNumber(),
    deliverer_name: name.findName(),
    deliverer_phone: phone.phoneNumber(),
    ...calculateOrderItems(pickedItems),
    items: pickedItems,
  });
};

const job = new CronJob("0 * * * * *", async () => {
  if (datatype.number({ min: 0, max: 100 }) < 80) {
    return;
  }
  generateOrder({
    itemModifiers: await fetchItemModifiers(),
    items: await fetchItems(),
    providers: await fetchProviders(),
  });
});
job.start();
