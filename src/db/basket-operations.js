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

const addProduct = async (userId, productId) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    const SQL = "INSERT INTO basket (user_id, product_id) VALUES(?, ?)";
    const [rows] = await connection.execute(SQL, [userId, productId]);
    if (rows && rows.affectedRows && rows.affectedRows > 0) {
      return [undefined, rows];
    }
    return ["Error while adding product into a basket", undefined];
  } catch (error) {
    return [error.message, undefined];
  }
};

const getBasket = async (userId) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    const SQL = `SELECT * FROM basket WHERE user_id = ?`;

    const [rows] = await connection.execute(SQL, [userId]);
    if (!rows) {
      console.log("rows: ", rows);
      return [
        `A basket identified with user:${userId} couldn't found,`,
        undefined,
      ];
    }
    return [undefined, rows];
  } catch (error) {
    return [error.message, undefined];
  }
};

const deleteProductFromBasket = async (userId, productId) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    const SQL = "DELETE FROM basket WHERE user_id=? and product_id = ? LIMIT 1";
    const [rows] = await connection.execute(SQL, [userId, productId]);
    return [undefined, rows];
  } catch (error) {
    return [error.message, undefined];
  }
};

module.exports = { addProduct, getBasket, deleteProductFromBasket };
