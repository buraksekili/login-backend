require("dotenv/config");
const { connectionRouter, manipRouter, basketRouter } = require("./routes");
const express = require("express");

const app = express();
app.use(express.json());
app.use("/", connectionRouter);
app.use("/", manipRouter);
app.use("/", basketRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server is running on", port));
