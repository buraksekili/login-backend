const mysql = require("mysql2/promise");
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = require("../config");

// Set the connection config object
const connectionConfig = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  multipleStatements: true,
};

const addRank = async (userId, productID, star) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    const SQL =
      "INSERT INTO Ranks(LoginnerID, ProductID, StarNumber) VALUES(?,?,?)";

    const [rows] = await connection.execute(SQL, [userId, productID, star]);
    if (rows && rows.affectedRows && rows.affectedRows > 0) {
      return [undefined, rows];
    }

    return ["Error while adding a rank.", undefined];
  } catch (error) {
    return [error.message, undefined];
  }
};

const getProductRanks = async (productId) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    const SQL = `SELECT SUM(StarNumber) as sum, Count(*) as count FROM ranks WHERE ProductID= ?`;

    const [rows] = await connection.execute(SQL, [productId]);
    if (!rows) {
      return [`Ranks for product:${productId} couldn't found,`, undefined];
    }
    return [undefined, rows];
  } catch (error) {
    return [error.message, undefined];
  }
};

module.exports = {
  getProductRanks,
  addRank,
};
