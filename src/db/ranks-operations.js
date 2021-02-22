const mysql = require("mysql2/promise");
const { connectionPool } = require("../config");

const addRank = async (userId, productId, star) => {
  try {
    const connection = await connectionPool.getConnection();
    let updated = false;
    let SQL = `Select * From Ranks where Ranks.LoginnerId=? and Ranks.ProductID=?`;
    let [rows] = await connection.execute(SQL, [userId, productId]);

    if (rows) {
      for (let el in rows) {
        if (rows[el].ProductID == productId) {
          updated = true;
          break;
        }
      }
    }

    if (!updated) {
      SQL =
        "INSERT INTO Ranks(LoginnerID, ProductID, StarNumber) VALUES(?,?,?)";
      [rows] = await connection.execute(SQL, [userId, productId, star]);
    } else {
      SQL = `UPDATE Ranks SET StarNumber=? WHERE LoginnerID=? and ProductID=?`;
      [rows] = await connection.execute(SQL, [star, userId, productId]);
    }

    if (rows && rows.affectedRows && rows.affectedRows > 0) {
      return [undefined, rows, updated];
    }

    return ["Error while adding a rank.", undefined];
  } catch (error) {
    return [error.message, undefined];
  }
};

const getProductRanks = async (productId) => {
  try {
    let connection = await connectionPool.getConnection();
    const SQL = `SELECT AVG(StarNumber) as Rating FROM ranks WHERE ProductID=?`;

    const [rows] = await connection.execute(SQL, [productId]);
    if (!rows) {
      connection.release();
      return [`Ranks for product:${productId} couldn't found,`, undefined];
    }
    connection.release();
    return [undefined, rows];
  } catch (error) {
    connection.release();
    return [error.message, undefined];
  }
};

module.exports = {
  getProductRanks,
  addRank,
};
