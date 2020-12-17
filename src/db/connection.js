const mysql = require("mysql2/promise");
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = require("../config");
const fs = require("fs");

// Set the connection config object
const connectionConfig = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  multipleStatements: true,
};

const login = async (mail, password, title) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    const SQL = `SELECT * FROM loginners WHERE LoginnerMail = ? and LoginnerPassword = ?`;
    const [rows] = await connection.execute(SQL, [mail, password]);

    console.log(`logging user with ${mail} - ${password} - ${title}`);

    if (!rows) {
      return ["The result is empty. Try again", undefined];
    }
    if (rows.length == 0) {
      return [`Invalid credentials`, undefined];
    }
    if (!title || title == "" || title.length == 0) {
      return ["Title field is empty for /login body.", undefined];
    }

    console.log("rows are", rows);
    return [undefined, rows];
  } catch (error) {
    return [error.message, undefined];
  }
};

const signup = async (mail, password, phone, title) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);

    console.log(
      `creating user with ${mail} - ${password} - ${phone} - ${title} `
    );

    // check if the email exists or not.
    let SQL = "SELECT * FROM loginners WHERE LoginnerMail = ?";
    let [rows] = await connection.execute(SQL, [mail]);

    if (!rows) {
      return ["The result is empty. Try again", undefined];
    }
    if (rows.length != 0) {
      return [`${mail} already exists.`, undefined];
    }

    SQL =
      "INSERT INTO loginners(LoginnerMail, LoginnerPassword, Phone, Title) VALUES(?, ?, ?, ?)";
    [rows] = await connection.execute(SQL, [mail, password, phone, title]);

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

const insertImage = async () => {
  try {
    const connection = await mysql.createConnection(connectionConfig);

    var onlyPath = require("path").dirname(
      "C:\\Users\\ASUS\\Downloads\\logo.png"
    );

    console.log(`path is ${onlyPath + "\\logo.png"}`);

    let SQL = `INSERT INTO Categories (CategoryName, CategoryImage, Active_Passive)  VALUES ('Beverages' LOAD_FILE('?') ,1)`;
    var query = "INSERT INTO `Categories` SET ?",
      values = {
        file_type: "img",
        file_size: buffer.length,
        file: buffer,
      };
    let [rows] = await connection.execute(SQL, [onlyPath]);

    if (!rows) {
      return ["The result is empty. Try again", undefined];
    }
    if (rows.length != 0) {
      return [`already exists.`, undefined];
    }

    return [undefined, rows];
  } catch (error) {
    return [error.message, undefined];
  }
};

module.exports = { login, signup, insertImage };
