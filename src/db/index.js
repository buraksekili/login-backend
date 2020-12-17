const { request } = require("express");

module.exports = {
  ...require("./connection"),
  // ...require("./user-manipulation"),
  // ...require("./basket-operations"),
  // ...require("./comments"),
  ...require("./product-operations"),
};
