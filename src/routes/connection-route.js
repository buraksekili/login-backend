const express = require("express");
const { login, signup } = require("../db");

const connectionRouter = express.Router();

connectionRouter.post("/login", async (req, res) => {
  if (req.body && req.body[0]) {
    const { mail, password } = req.body[0];

    const [error, response] = await login(mail, password);

    if (error) {
      return res.status(401).json({ auth: false, error });
    }

    if (response && response.length > 0) {
      return res.json({
        auth: true,
        user_id: response[0].user_id,
        user_mail: response[0].user_email,
      });
    }
  }
  return res.status(401).json({ error: "Invalid request body." });
});

connectionRouter.post("/signup", async (req, res) => {
  if (req.body && req.body[0]) {
    const { mail, password } = req.body[0];

    const [error, response] = await signup(mail, password);

    if (error) {
      return res.status(400).json({ error, status: false });
    }

    if (response && response.affectedRows && response.affectedRows > 0) {
      return res.json({ message: `${mail} is created`, status: true });
    }
  }
  return res.status(401).json({ error: "Invalid request body." });
});

module.exports = { connectionRouter };
