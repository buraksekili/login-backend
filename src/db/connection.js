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

const login = async (mail, password) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    const SQL = `SELECT * FROM user WHERE user_email = ? and user_password = ?`;
    const [rows] = await connection.execute(SQL, [mail, password]);

    if (!rows) {
      return ["The result is empty. Try again", undefined];
    }
    if (rows.length == 0) {
      return [`Invalid credentials`, undefined];
    }
    return [undefined, rows];
  } catch (error) {
    return [error.message, undefined];
  }
};

const signup = async (mail, password) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    // check if the email exists or not.
    let SQL = "SELECT * FROM user WHERE user_email = ?";
    let [rows] = await connection.execute(SQL, [mail]);

    if (!rows) {
      return ["The result is empty. Try again", undefined];
    }
    if (rows.length != 0) {
      return [`${mail} already exists.`, undefined];
    }

    SQL = "INSERT INTO user(user_email, user_password) VALUES(?, ?)";
    [rows] = await connection.execute(SQL, [mail, password]);

    if (!rows) {
      return ["The result is empty. Try again", undefined];
    }
    if (rows.length == 0) {
      return [`${mail} couldn't created.`, undefined];
    }
    return [undefined, rows];
  } catch (error) {
    return [error.message, undefined];
  }
};

module.exports = { login, signup };
