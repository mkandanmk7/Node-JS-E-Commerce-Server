const db = require("../shared/mongo");
const { ObjectId } = require("mongodb");
const { resetToken } = require("./auth.service");

const service = {
  //create
  async createOrder(req, res) {
    console.log("create order");
    try {
      let order = { ...req.body, createdAt: new Date() };
      const orderDetails = await db.orders.insertOne(order);
      res.status(200).send(orderDetails);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  //update
  async updateOrder(req, res) {
    console.log("update order");
    try {
      const updatedOrder = await db.orders.findOneAndUpdate(
        { _id: ObjectId(req.params.id) },
        { $set: req.body },
        { ReturnDocument: "after" }
      );
      res.status(200).send(updatedOrder);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  //delete
  async deleteOrder(req, res) {
    console.log("delete order");
    try {
      await db.orders.deleteOne({ _id: ObjectId(req.params.id) });
      res.status(200).send("Deleted order");
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  //get
  async getOrder(req, res) {
    console.log("get order");
    try {
      const get = await db.orders.find({ userId: req.params.id }).toArray();
      console.log(get);
      res.status(200).send(get);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  //get upto 5 order
  async getAllOrder(req, res) {
    console.log("get all order");
    try {
      const orders = await db.orders.find().limit(5).toArray();
      res.status(200).send(orders);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
};

module.exports = service;
