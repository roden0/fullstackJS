const {APP_HOST, APP_PORT} = require('dotenv').config().parsed;
const express = require("express");
const connectDb = require("./src/connection");
const User = require("./src/user.model.js");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello from Node.js app \n");
});

app.get("/users", async (req, res) => {
    const users = await User.find().exec().catch(e=>console.error(e.message));
    return res.json(users);
});

app.post("/user", async (req, res) => {
    if(!Object.keys(req.body).length) return res.send("No data provided \n");
    const user = new User(req.body);
    await user.save().then(() => console.log("User created"));
    res.send("User created \n");
});

app.get("/user-create", async (req, res) => {
  const max = 1000;
  const min = 1;
  const username = `userTest-${Math.floor(Math.random() * (max - min)) + min}`;
  
  const user = new User({username});

  await user.save().then(() => console.log("User created"));

  res.send("User created \n");
});

app.listen(APP_PORT, APP_HOST, () => {
  console.log(`Running on ${APP_HOST}:${APP_PORT}`);

  connectDb().then(() => {
    console.log("MongoDb connected");
  });
});
