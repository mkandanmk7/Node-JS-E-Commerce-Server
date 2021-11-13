const db = require("../shared/mongo");
const { ObjectId, ServerCapabilities } = require("mongodb");

const service = {
  //create cart
  async createCart(req, res) {
    console.log("create Process");
    try {
      const cart = await db.cart.insertOne(req.body);
      res.status(200).send(cart);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  //update cart
  async updateCart(req, res) {
    console.log("update Process");
    try {
      const update = await db.cart.findOneAndUpdate(
        { _id: ObjectId(req.params.id) },
        { $set: req.body },
        { ReturnDocument: "after" }
      );
      res.status(200).send(update);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  //delete cart
  async deleteCart(req, res) {
    console.log("delete Process");
    try {
      await db.cart.deleteOne({ _id: ObjectId(req.params.id) });
      res.status(200).send("cart deleted");
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  //get cart
  async getCart(req, res) {
    console.log("get Process");
    try {
      const cartDetails = await db.cart.findOne({
        _id: ObjectId(req.params.userid),
      });
      res.status(200).send(cartDetails);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  //get all cart
  async getAllCart(req, res) {
    console.log("get all Process");
    try {
      const carts = await db.cart.find().toArray();

      res.status(200).send(carts);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
};

module.exports = service;
