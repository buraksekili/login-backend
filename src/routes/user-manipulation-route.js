const express = require("express");
const manipRouter = express.Router();
const { passwordChange } = require("../db");

manipRouter.post("/user/:id/change", async (req, res) => {
  if (req.body && req.body[0]) {
    const [error, response] = await passwordChange(
      req.params.id,
      req.body[0].password
    );

    if (error) {
      return res.status(400).json({ error, status: false });
    }
    if (response && response.affectedRows !== 0) {
      return res.json({
        user_id: req.params.id,
        status: true,
        message: `The password of the user with id ${req.params.id} changed`,
      });
    }
  }
  return res.status(400).json({ error: "Invalid request body." });
});

module.exports = { manipRouter };
