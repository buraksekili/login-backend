const mysql = require("mysql2/promise");
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = require("../config");
const { hashPassword } = require("../helper");
const bcrypt = require("bcrypt");

// Set the connection config object
const connectionConfig = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  multipleStatements: true,
};

const getUserById = async (userId) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    let SQL = `SELECT * FROM loginners WHERE LoginnerID=?`;
    let [rows] = await connection.execute(SQL, [userId]);

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

const login = async (mail, password) => {
  try {
    if (!password || password == "" || password.length == 0) {
      return ["Password field is empty for /login body.", undefined];
    }

    const connection = await mysql.createConnection(connectionConfig);
    let SQL = `SELECT * FROM loginners WHERE LoginnerMail = ?`;
    let [rows] = await connection.execute(SQL, [mail]);

    if (!rows) {
      return ["The result is empty. Try again", undefined];
    }
    if (rows.length == 0) {
      return [`Invalid credentials`, undefined];
    }

    const hashedPassword = rows[0].LoginnerPassword.toString();
    const result = await bcrypt.compare(password, hashedPassword);
    if (!result) {
      return ["Unauthorized! Wrong credential", undefined];
    }

    let { ID, LoginnerMail, Title } = rows[0];
    if (Title == "E") {
      SQL = `SELECT * FROM productmanageremployerloginners WHERE PMELID = ?`;
      [rows] = await connection.execute(SQL, [ID]);
      if (rows && rows.length > 0) {
        Title = "P";
      } else {
        Title = "S";
      }
    }
    return [undefined, { status: result, title: Title, ID }];
  } catch (error) {
    return [error.message, undefined];
  }
};

const signup = async (mail, password, phone, title) => {
  try {
    const [error, hashedPassword] = await hashPassword(password);
    if (error) {
      return ["Error while hashing a password", undefined];
    }

    const connection = await mysql.createConnection(connectionConfig);

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
    [rows] = await connection.execute(SQL, [
      mail,
      hashedPassword,
      phone,
      title,
    ]);

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

const addCustomer = async (
  loginnerId,
  contactName,
  address,
  creditCardNo,
  city,
  postalCode
) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);

    let SQL = "INSERT INTO CustomerLoginners VALUES(?, ?, ?, ?, ?, ?)";
    let [rows] = await connection.execute(SQL, [
      loginnerId,
      contactName,
      address,
      creditCardNo,
      city,
      postalCode,
    ]);

    if (!rows) {
      return ["The result is empty. Try again", undefined];
    }

    return [undefined, rows];
  } catch (error) {
    return [error.message, undefined];
  }
};

const addEmployee = async (
  loginnerId,
  firstname,
  lastname,
  hireDate,
  postalCode,
  title
) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);

    // check if the email exists or not.
    let SQL = "INSERT INTO employeeloginners VALUES(?, ?, ?, ?, ?, ?)";
    let [rows] = await connection.execute(SQL, [
      loginnerId,
      firstname,
      lastname,
      hireDate,
      postalCode,
      title,
    ]);

    if (!rows) {
      return ["The result is empty. Try again", undefined];
    }

    console.log("Employee inserted into employee table.");

    // now, insert employees into corresponding table s.t. pm table
    if (title == "P") {
      SQL = "INSERT INTO ProductManagerEmployerLoginners VALUES(?)";
      [rows] = await connection.execute(SQL, [loginnerId]);
      if (!rows) {
        return ["The result is empty. Try again", undefined];
      }

      console.log("Employee is PM and inserted into PM table.");
      return [undefined, rows];
    } else if (title == "S") {
      SQL = "INSERT INTO SalesManagerEmployerLoginners(SMELID) VALUES(?)";
      [rows] = await connection.execute(SQL, [loginnerId]);

      if (!rows) {
        return ["The result is empty. Try again", undefined];
      }
      console.log("Employee is SM and inserted into SM table.");
      return [undefined, rows];
    }

    return ["You must be an PM or SM", undefined];
  } catch (error) {
    return [error.message, undefined];
  }
};

module.exports = { getUserById, login, signup, addCustomer, addEmployee };
