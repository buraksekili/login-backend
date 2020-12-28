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

const createOrder = async (userId, orderDate, status) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    const SQL =
      "INSERT INTO Orders(LoginnerID, OrderDate, Active_Passive) VALUES(?,?,?)";

    const [rows] = await connection.execute(SQL, [userId, orderDate, status]);
    if (rows && rows.affectedRows && rows.affectedRows > 0) {
      return [undefined, rows];
    }

    return ["Error while creating an order.", undefined];
  } catch (error) {
    return [error.message, undefined];
  }
};

const createOrderDetails = async (orderId, productId) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    const SQL = "INSERT INTO OrderDetails(OrderID, ProductID) VALUES(?,?)";

    const [rows] = await connection.execute(SQL, [orderId, productId]);
    if (rows && rows.affectedRows && rows.affectedRows > 0) {
      return [undefined, rows];
    }

    return ["Error while creating an order detail.", undefined];
  } catch (error) {
    return [error.message, undefined];
  }
};

const getAllOrderDetails = async (userId) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    const SQL = `SELECT * FROM orderdetails o, orders o1, products p WHERE o.OrderID=o1.OrderID and LoginnerId=? and p.ProductID=o.ProductID 
    ;`;

    const [rows] = await connection.execute(SQL, [userId]);
    if (!rows) {
      return [`A basket for user:${userId} couldn't found,`, undefined];
    }
    return [undefined, rows];
  } catch (error) {
    return [error.message, undefined];
  }
};

const getOrders = async (userId) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    const SQL = `SELECT * FROM orders WHERE LoginnerID = ?`;

    const [rows] = await connection.execute(SQL, [userId]);
    if (!rows) {
      return [`A basket for user:${userId} couldn't found,`, undefined];
    }
    return [undefined, rows];
  } catch (error) {
    return [error.message, undefined];
  }
};

// eksik
const getOrderDetails = async (orderId) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    const SQL = `SELECT * FROM orderdetails o, products p WHERE o.OrderID=? and o.ProductID=p.ProductID`;
    const [rows] = await connection.execute(SQL, [orderId]);

    if (!rows || rows.length == 0) {
      return ["empty result", undefined];
    }
    return [undefined, rows];
  } catch (error) {
    return [error.message, undefined];
  }
};

const productCountsFromOrder = async (productId, orderId) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    const SQL = `SELECT COUNT(*) as c FROM orderdetails WHERE OrderID=? and ProductID=?;`;
    const [rows] = await connection.execute(SQL, [orderId, productId]);

    if (!rows) {
      return [`Couldn't get the count of product:${productId}`, undefined];
    }
    return [undefined, rows];
  } catch (error) {
    return [error.message, undefined];
  }
};

const deleteOrder = async (orderId) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    const SQL = "DELETE FROM orders where OrderID=?;";
    console.log(`${orderId} will be deleted`);
    const [rows] = await connection.execute(SQL, [orderId]);

    console.log("before rows", rows);
    if (rows.affectedRows == 0) {
      return ["Order couldn't deleted!", undefined];
    }
    console.log("after rows");
    return [undefined, rows];
  } catch (error) {
    return [error.message, undefined];
  }
};

module.exports = {
  createOrder,
  createOrderDetails,
  getOrders,
  deleteOrder,
  productCountsFromOrder,
  getOrderDetails,
  getAllOrderDetails,
};
