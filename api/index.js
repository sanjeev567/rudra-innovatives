const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
dotenv.config();
const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(console.log("mongo is connected successfully...."))
  .catch((e) => console.log("Error Connection failed Mongodb: " + e));

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

app.listen(8000, () => {
  console.log("Backend is running at port: 8000");
});
