require("dotenv/config");
const {
  connectionRouter,
  manipRouter,
  basketRouter,
  commentsRouter,
  productRouter,
  orderRoute,
  ranksRoute,
} = require("./routes");
const express = require("express");
const fs = require("fs");
const path = require("path");

try {
  if (!fs.existsSync(path.join(__dirname, "../uploads"))) {
    fs.mkdirSync(path.join(__dirname, "../uploads"));
  }
} catch {
  console.log("Already set up");
}

const app = express();
app.use(express.json());
app.use("/", connectionRouter);
app.use("/", orderRoute);
app.use("/", basketRouter);
app.use("/", ranksRoute);
app.use("/", commentsRouter);
app.use("/", productRouter);
app.use(express.static("uploads"));

const port = process.env.PORT || 5000;
module.exports = app.listen(port, () =>
  console.log("Server is running on", port)
);
