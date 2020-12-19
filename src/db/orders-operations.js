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
    const SQL = `SELECT COUNT(*) as count FROM products WHERE ProductID=?`;
    const [rows] = await connection.execute(SQL, [userId]);

    console.log("rows: ", rows);

    if (!rows) {
      return [``, undefined];
    }
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

const deleteOrder = async (userId, orderId) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    let SQL = "SELECT LoginnerMail, Title FROM Loginners WHERE ID=? LIMIT 1";
    let [rows] = await connection.execute(SQL, [userId]);

    const userTitle = rows[0].Title;
    if (userTitle != "E") {
      return ["You must be a PM to delete order", undefined];
    }

    let tmpSQL = "SELECT Title FROM employeeloginners WHERE LoginnerID=?";
    let [empRows] = await connection.execute(tmpSQL, [userId]);

    const employeeTitle = empRows[0].Title;
    if (employeeTitle != "S") {
      return ["You must be a SM to delete order", undefined];
    }

    // now delete order
    SQL = "DELETE FROM orders WHERE OrderID=?";
    [rows] = await connection.execute(SQL, [orderId]);
    if (rows.affectedRows == 0) {
      return ["Order couldn't deleted!", undefined];
    }
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
};
