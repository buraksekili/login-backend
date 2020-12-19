const { request } = require("express");

module.exports = {
  ...require("./connection"),
  ...require("./orders-operations"),
  ...require("./basket-operations"),
  ...require("./comments"),
  ...require("./ranks-operations"),
  ...require("./product-operations"),
};
