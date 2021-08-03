"use strict";

const {
  disallowNullNumber,
  allowNullString,
  allowNullNumber,
  disallowNullString,
} = require("../_utils.js/commonColumSettings");

const buildColumns = (Sequelize) => {
  return {
    reference: { type: Sequelize.STRING, ...disallowNullString },
    total: { type: Sequelize.DOUBLE, ...disallowNullNumber },
    iva: { type: Sequelize.DOUBLE, ...disallowNullNumber },
    sub_total: { type: Sequelize.DOUBLE, ...disallowNullNumber },
    discount: { type: Sequelize.DOUBLE, ...allowNullNumber },
    coupon: { type: Sequelize.STRING, ...allowNullString },
    client_name: { type: Sequelize.STRING, ...allowNullString },
    client_phone: { type: Sequelize.STRING, ...allowNullString },
    deliverer_name: { type: Sequelize.STRING, ...allowNullString },
    deliverer_phone: { type: Sequelize.STRING, ...allowNullString },
  };
};

const defaultReferences = (Sequelize) => {
  return {
    provider_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "providers", key: "id" },
    },
    payment_method: {
      type: Sequelize.ENUM(
        "EPAYMENT",
        "CREDIT",
        "DEBIT",
        "CASH",
        "DEPOSIT",
        "CUSTOM"
      ),
      allowNull: false,
      defaultValue: "EPAYMENT",
    },
    payment_reference: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM("HOLD", "ACCEPTED", "DECLINED", "CANCELLED"),
      allowNull: false,
      defaultValue: "HOLD",
    },
  };
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "orders",
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        ...defaultReferences(Sequelize),
        ...buildColumns(Sequelize),
        created_at: {
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          type: Sequelize.DATE,
        },
        updated_at: {
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
          type: Sequelize.DATE,
        },
      },
      {}
    );
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("orders");
  },
};
