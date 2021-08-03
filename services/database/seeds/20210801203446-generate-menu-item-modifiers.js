"use strict";
const R = require("ramda");
const { indexResponse } = require("../_utils.js/commonFunctions");
const items = require("./data/items-modifiers");

module.exports = {
  up: async (queryInterface) => {
    const indexedItems = await queryInterface.sequelize
      .query("SELECT id, name FROM items;")
      .then(R.propOr([], 0))
      .then(indexResponse);
    const relatedItems = R.pipe(
      R.map((value) =>
        R.pipe(
          R.propOr([], "modifiers"),
          R.map(R.assoc("item_id", indexedItems[value.name]))
        )(value)
      ),
      R.flatten
    )(items);

    await queryInterface.bulkInsert("item_modifiers", relatedItems, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("item_modifiers", null, {});
  },
};
