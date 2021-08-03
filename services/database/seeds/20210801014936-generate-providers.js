"use strict";

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      "providers",
      [
        { name: "UBER" },
        { name: "RAPPI" },
        { name: "DIDI" },
        { name: "CUSTOM" },
      ],
      {}
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("providers", null, {});
  },
};
