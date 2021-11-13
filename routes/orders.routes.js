const router = require("express").Router();
const service = require("../services/order.service");
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("../services/verifyToken.service");

//create order
router.post("/", verifyToken, service.createOrder);

//update order
router.put("/:id", verifyTokenAndAdmin, service.updateOrder);

//delete order
router.delete("/:id", verifyTokenAndAdmin, service.deleteOrder);

//get user order
router.get("/find/:userId", verifyTokenAndAuthorization, service.getOrder);

//get All users order
router.get("/", verifyTokenAndAdmin, service.getAllOrder);

//get monthly income
// router.get("/income",verfiyTokenAndAdmin,service.getIncome)

module.exports = router;
