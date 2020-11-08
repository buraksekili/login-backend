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

const passwordChange = async (userId, newPassword) => {
  const connection = await mysql.createConnection(connectionConfig);
  console.log(`${userId} ${newPassword}`);

  const SQL = "UPDATE user SET user_password = ? WHERE user_id = ?";
  try {
    const [rows] = await connection.execute(SQL, [newPassword, userId]);
    if (rows && rows.affectedRows > 0) {
      return [undefined, rows];
    }
    return ["db query has returned empty", undefined];
  } catch (error) {
    return [error.message, undefined];
  }
};

// first, check user's role then allow deletion.
const deleteUser = async (mail) => {
  const connection = await mysql.createConnection(connectionConfig);
  const SQL = "DELETE FROM user WHERE user_email = ?";
  try {
    await connection.execute(SQL, [mail]);
    return { error: false };
  } catch (error) {
    return { error: true };
  }
};

module.exports = { passwordChange, deleteUser };
