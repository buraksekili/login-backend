// const {connectionRouter}

module.exports = {
  ...require("./connection-route"),
  ...require("./user-manipulation-route"),
  ...require('./basket-route')
};