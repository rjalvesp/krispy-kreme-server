const router = require("express").Router();

const getOrdersDatatable = require("../../controllers/v1/orders/getOrdersDatatable");
const getOrderById = require("../../controllers/v1/orders/getOrderById");
const updateOrderById = require("../../controllers/v1/orders/updateOrderById");
const ensureOrdersDatatable = require("../../middlewares/body/ensureOrdersDatatable");
const ensureOrderUpdate = require("../../middlewares/body/ensureOrderUpdate");

router.get("/:id", (req, res) => {
  getOrderById(req.params).then((value) => {
    res.status(200).json(value);
  });
});

router.put("/:id", ensureOrderUpdate, (req, res) => {
  updateOrderById(req.params, req.body).then((value) => {
    res.status(200).json(value);
  });
});

router.post("/datatable", ensureOrdersDatatable, (req, res) => {
  getOrdersDatatable(req.body).then((value) => {
    res.status(200).json(value);
  });
});

module.exports = router;
