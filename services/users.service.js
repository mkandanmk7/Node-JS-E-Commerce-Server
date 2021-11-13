const db = require("../shared/mongo");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const mongo = require("../shared/mongo");

const service = {
  //update user
  async updateUser(req, res) {
    console.log("update process");
    try {
      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, Number(12));
      }
      console.log(req.user.userId);
      const updateduser = await db.users.findOneAndUpdate(
        { _id: ObjectId(req.user.userId) },
        { $set: req.body },
        { ReturnDocument: "after" }
      );
      res.status(200).send(updateduser);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  //detete user

  //get user with id
  async getUser(req, res) {
    console.log("get user with id process");
    try {
      const user = await db.users.findOne({ _id: ObjectId(req.params.id) });
      if (!user) return res.status(400).send("user not found");
      const { password, ...others } = user;
      res.status(200).send({ ...others });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  //get all user

  //get user stats
};

module.exports = service;
