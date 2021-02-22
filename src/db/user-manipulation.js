const mysql = require("mysql2/promise");
const { hashPassword } = require("../helper");
const { connectionPool } = require("../config");

const getAllUsers = async () => {
  const connection = await connectionPool.getConnection();
  const SQL = "SELECT ID, LoginnerMail, Title FROM loginners";
  try {
    const [rows] = await connection.execute(SQL, []);
    if (rows) {
      return [undefined, rows];
    }
    return ["couldn't get all users", undefined];
  } catch (error) {
    return [error.message, undefined];
  }
};

const updateProfile = async (userId, newPassword) => {
  const connection = await connectionPool.getConnection();
  const [error, hashedPassword] = await hashPassword(newPassword);
  if (error) {
    return ["Error while hashing a password", undefined];
  }

  const SQL = "UPDATE loginners SET LoginnerPassword = ? WHERE ID = ?";
  try {
    const [rows] = await connection.execute(SQL, [hashedPassword, userId]);
    if (rows && rows.affectedRows > 0) {
      return [undefined, rows];
    }
    return ["db query has returned empty", undefined];
  } catch (error) {
    return [error.message, undefined];
  }
};

const passwordChange = async (userId, newPassword) => {
  const connection = await connectionPool.getConnection();

  const SQL = "UPDATE loginners SET LoginnerPassword = ? WHERE user_id = ?";
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
  const connection = await connectionPool.getConnection();
  const SQL = "DELETE FROM user WHERE user_email = ?";
  try {
    await connection.execute(SQL, [mail]);
    return [undefined];
  } catch (error) {
    return [true];
  }
};

const getUserIdFromMail = async (mail) => {
  const connection = await connectionPool.getConnection();
  const SQL = "SELECT * FROM user WHERE user_email = ?";
  try {
    const [rows] = await connection.execute(SQL, [mail]);
    if (rows && rows.length > 0) {
      return [undefined, rows[0].user_id];
    }
    return [`User ${mail} couldn't found.`, undefined];
  } catch (error) {
    return [error.message, undefined];
  }
};

module.exports = {
  passwordChange,
  deleteUser,
  getUserIdFromMail,
  updateProfile,
  getAllUsers,
};
