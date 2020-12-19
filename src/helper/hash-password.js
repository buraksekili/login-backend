const bcrypt = require("bcrypt");

async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password, salt);
    return [undefined, hashedPassword];
  } catch (error) {
    console.log("error", error);
    return [error, undefined];
  }
}

module.exports = { hashPassword };
