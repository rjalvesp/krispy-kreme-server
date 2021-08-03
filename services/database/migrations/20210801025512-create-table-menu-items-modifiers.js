"use strict";

const { disallowNullString } = require("../_utils.js/commonColumSettings");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("item_modifiers", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      item_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "items", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      group: { type: Sequelize.STRING, ...disallowNullString },
      name: { type: Sequelize.STRING, ...disallowNullString },
      price: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: null,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("item_modifiers");
  },
};
