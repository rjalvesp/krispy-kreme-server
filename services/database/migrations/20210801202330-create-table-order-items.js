"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("order_items", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      order_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "orders", key: "id" },
      },
      item_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "items", key: "id" },
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("order_items");
  },
};
