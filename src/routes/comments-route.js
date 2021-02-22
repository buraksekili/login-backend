const express = require("express");
const { addComment, getComments } = require("../db");
const commentsRouter = express.Router();

commentsRouter.post("/comment/:productId", async (req, res) => {
  if (req.body && req.body) {
    const [error, response, updated] = await addComment(
      req.body.userId,
      req.params.productId,
      req.body.comment
    );

    if (error) {
      return res.status(400).json({ error, status: false });
    }

    if (response && response.affectedRows > 0) {
      return res.json({
        status: true,
        updated,
        comment_id: response.insertId,
      });
    }
  }
  return res.status(400).json({ error: "Invalid request body." });
});

commentsRouter.get("/comments/:productId", async (req, res) => {
  if (req.params && req.params) {
    const [error, response] = await getComments(req.params.productId);

    if (error) {
      return res.status(400).json({ error, status: false });
    }
    if (response && response.length > 0) {
      return res.json(response);
    }
    return res.json(response);
  }
  return res.status(400).json({ error: "Invalid request body." });
});

module.exports = { commentsRouter };
