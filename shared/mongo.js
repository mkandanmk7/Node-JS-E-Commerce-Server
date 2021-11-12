const { MongoClient } = require("mongodb");

// const MONGODB_URL =
//   "mongodb+srv://muthu:muthu123@cluster1.q9tm6.mongodb.net/ecommerce?retryWrites=true&w=majority";
// const MONGODB_NAME = "ecommerce";

const client = new MongoClient(process.env.MONGODB_URL);

module.exports = {
  db: null,
  users: null,
  products: null,
  orders: null,
  cart: null,

  async connect() {
    await client.connect(); //connect to DB
    console.log(`DB connected at ${process.env.MONGODB_URL}`);

    //select db
    this.db = client.db(process.env.MONGODB_NAME);
    console.log(`${process.env.MONGODB_NAME} DB selected`);

    //choose collection;
    this.users = this.db.collection("users");
    this.products = this.db.collection("products");
    this.orders = this.db.collection("orders");
    this.cart = this.db.collection("cart");
  },
};
