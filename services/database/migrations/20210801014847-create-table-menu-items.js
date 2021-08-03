"use strict";

const {
  disallowNullString,
  disallowNullNumber,
  allowNullString,
} = require("../_utils.js/commonColumSettings");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("items", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
        ...disallowNullString,
      },
      description: {
        type: Sequelize.TEXT,
        ...allowNullString,
      },
      type: {
        type: Sequelize.STRING,
        ...disallowNullString,
      },
      price: {
        type: Sequelize.DOUBLE,
        ...disallowNullNumber,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("items");
  },
};
