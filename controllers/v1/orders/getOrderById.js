const getOrderById = require("../../../models/orders/getOrderById");

module.exports = ({ id }) => Promise.resolve(id).then(getOrderById);
