const updateOrderById = require("../../../models/orders/updateOrderById");

module.exports = ({ id }, { status }) =>
  Promise.resolve({ id, status }).then(updateOrderById);
