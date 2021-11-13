const db = require("../shared/mongo");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

const service = {
  //update user
  async updateUser(req, res) {
    console.log("update process");
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
