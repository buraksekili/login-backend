const express = require("express");
const { addComment } = require("../db");
const commentsRouter = express.Router();

commentsRouter.post("/comment/:product_id", async (req, res) => {
  if (req.body && req.body[0]) {
    const [error, response] = await addComment(
      req.body[0].user_id,
      req.params.product_id,
      req.body[0].comment
    );

    if (error) {
      return res.status(400).json({ error, status: false });
    }

    if (response && response.affectedRows > 0) {
      console.log("comment: ", response);
      return res.json({
        status: true,
        comment_id: response.insertId,
      });
    }
  }
  return res.status(400).json({ error: "Invalid request body." });
});

module.exports = { commentsRouter };
