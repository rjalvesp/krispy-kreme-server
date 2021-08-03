const getOrdersDatatable = require("../../../models/orders/getOrdersDatatable");

module.exports = (body) =>
  Promise.resolve({ limit: 10, offset: 0, ...body }).then(getOrdersDatatable);
