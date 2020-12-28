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

const addProductIntoBasket = async (userId, productId) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    const SQL = "INSERT INTO basket (LoginnerID, ProductID) VALUES(?, ?)";

    const [rows] = await connection.execute(SQL, [userId, productId]);
    if (rows && rows.affectedRows && rows.affectedRows > 0) {
      return [undefined, rows];
    }

    return ["Error while adding product into a basket", undefined];
  } catch (error) {
    return [error.message, undefined];
  }
};

const getUserBasketDetails = async (userId) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    const SQL = `SElECT * FROM basket b, products p WHERE p.ProductID = b.ProductID and b.LoginnerID = ?`;

    const [rows] = await connection.execute(SQL, [userId]);
    if (!rows) {
      return [`A basket for user:${userId} couldn't found,`, undefined];
    }
    return [undefined, rows];
  } catch (error) {
    return [error.message, undefined];
  }
};

const getUserBasket = async (userId) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    const SQL = `SELECT * FROM basket WHERE LoginnerID = ?`;

    const [rows] = await connection.execute(SQL, [userId]);
    if (!rows) {
      return [`A basket for user:${userId} couldn't found,`, undefined];
    }
    return [undefined, rows];
  } catch (error) {
    return [error.message, undefined];
  }
};

const getProductCountFromBasket = async (userId, productId) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    const SQL = `SELECT COUNT(*) as count FROM basket WHERE LoginnerID=? and ProductId=?`;

    const [rows] = await connection.execute(SQL, [userId, productId]);
    if (!rows) {
      return [`A basket for user:${userId} couldn't found,`, undefined];
    }
    return [undefined, rows];
  } catch (error) {
    return [error.message, undefined];
  }
};

const deleteProductFromBasket = async (userId, productId) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    const SQL = "DELETE FROM basket WHERE LoginnerID=? and ProductID=? LIMIT 1";
    const [rows] = await connection.execute(SQL, [userId, productId]);
    return [undefined, rows];
  } catch (error) {
    return [error.message, undefined];
  }
};

const clearBasket = async (userId) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    const SQL = "DELETE FROM basket WHERE LoginnerID=?";
    const [rows] = await connection.execute(SQL, [userId]);
    return [undefined, rows];
  } catch (error) {
    return [error.message, undefined];
  }
};

module.exports = {
  addProductIntoBasket,
  getUserBasket,
  getProductCountFromBasket,
  deleteProductFromBasket,
  getUserBasketDetails,
  clearBasket,
};
