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
  async deleteUser(req, res) {
    try {
      await db.users.deleteOne({ _id: ObjectId(req.params.id) });
      res.status(200).send("user deleted");
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

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
  async getAllUser(req, res) {
    const query = req.query.new;
    try {
      //use toArray for find();
      const users = query
        ? await db.users.find().sort({ _id: -1 }).limit(5).toArray()
        : await db.users.find().toArray();

      console.log(users);
      res.status(200).send(users);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  //get user stats
  async userStats(req, res) {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
      const data = await db.users
        .aggregate([
          { $match: { createdAt: { $gte: lastYear } } },
          {
            $project: {
              month: { $month: "$createdAt" },
            },
          },
          { $group: { _id: "$month", total: { $sum: 1 } } },
        ])
        .toArray();
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
};

module.exports = service;
