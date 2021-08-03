"use strict";
const R = require("ramda");
const { v4 } = require("uuid");
const items = require("./data/items");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      "items",
      R.map((value) => R.assoc("id", v4(), value), items),
      {}
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("items", null, {});
  },
};
