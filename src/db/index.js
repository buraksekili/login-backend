const { request } = require("express");

module.exports = {
  ...require("./connection"),
  ...require("./orders-operations"),
  ...require("./basket-operations"),
  ...require("./user-manipulation"),
  ...require("./comments"),
  ...require("./ranks-operations"),
  ...require("./product-operations"),
};
