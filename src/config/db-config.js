const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
const mysql = require("mysql2/promise");

const connectionConfig = {
  connectionLimit: 80,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  multipleStatements: true,
};



var connectionPool = mysql.createPool(connectionConfig)

// console.log("process.env", process.env);
module.exports = {connectionPool, connectionConfig, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME };
