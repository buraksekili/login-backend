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

const getComments = async (productId) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    const SQL = `SELECT c.CommentDescription, c.CommentsLineID, 
                        c.LoginnerID, c.ProductID, l.LoginnerMail 
                FROM comments c, loginners l 
                where c.ProductID=? and l.ID = c.LoginnerID;`;
    const [rows] = await connection.execute(SQL, [productId]);

    if (rows) {
      return [undefined, rows];
    }
    return ["Error while getting comments", undefined];
  } catch (error) {
    return [error.message, undefined];
  }
};

const addComment = async (userId, productId, comment) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);

    let updated = false;
    let controlSQL = `SELECT * FROM comments where comments.LoginnerID=?`;
    const [controlRow] = await connection.execute(controlSQL, [userId]);

    let SQL;
    let rows;

    if (controlRow) {
      for (let el in controlRow) {
        if (controlRow[el].ProductID == productId) {
          updated = true;
          break;
        }
      }
    }

    if (!updated) {
      SQL =
        "INSERT INTO comments (LoginnerID, ProductID, CommentDescription) VALUES(?, ?, ?)";
      [rows] = await connection.execute(SQL, [userId, productId, comment]);
      console.log("inserting");
    } else {
      SQL =
        "UPDATE comments SET CommentDescription=? WHERE LoginnerID=? and ProductID=?";
      [rows] = await connection.execute(SQL, [comment, userId, productId]);
      console.log("updating");
    }
    if (rows) {
      return [undefined, rows, updated];
    }
    return ["Error while adding product into a basket", undefined];
  } catch (error) {
    return [error.message, undefined];
  }
};

module.exports = { addComment, getComments };
