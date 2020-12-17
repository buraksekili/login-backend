const express = require("express");
const { login, signup } = require("../db");

const connectionRouter = express.Router();

connectionRouter.post("/login", async (req, res) => {
  if (req.body && req.body[0]) {
    const { mail, password, title } = req.body[0];

    const [error, response] = await login(mail, password, title);

    if (error) {
      return res.status(401).json({ status: false, error });
    }

    if (response && response.length > 0) {
      return res.json({
        status: true,
        user_id: response[0].ID,
        user_mail: response[0].LoginnerMail,
        user_title: response[0].Title,
      });
    }
  }
  return res.status(401).json({ error: "Invalid request body." });
});

connectionRouter.post("/signup", async (req, res) => {
  if (req.body && req.body[0]) {
    const { mail, password, phone, title } = req.body[0];
    // Insert incoming user into db.
    const [error, response] = await signup(mail, password, phone, title);

    // occurred error while inserting a logginer into db.
    if (error) {
      return res.status(400).json({ error, status: false });
    }

    // if we have response from the db.
    if (response && response.affectedRows && response.affectedRows > 0) {
      return res.json({ message: `${mail} is created`, status: true });
    }
  }
  // invalid json body.
  return res.status(401).json({ error: "Invalid request body." });
});

module.exports = { connectionRouter };
