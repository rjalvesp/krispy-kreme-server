"use strict";

const { disallowNullString } = require("../_utils.js/commonColumSettings");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("providers", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
        ...disallowNullString,
      },
      status: {
        type: Sequelize.ENUM("ENABLED", "DISABLED"),
        allowNull: false,
        defaultValue: "ENABLED",
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("providers");
  },
};
