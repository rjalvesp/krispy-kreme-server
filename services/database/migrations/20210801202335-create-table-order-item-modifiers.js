"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("order_item_modifiers", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      order_item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "order_items", key: "id" },
      },
      item_modifier_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "item_modifiers", key: "id" },
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("order_item_modifiers");
  },
};
