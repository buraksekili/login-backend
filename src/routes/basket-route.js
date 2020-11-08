const express = require("express");
const { addProduct } = require("../db");

const basketRouter = express.Router();

basketRouter.post("/add/:product_id", async (req, res) => {
  if (req.body && req.body[0]) {
    const productId = req.params.product_id;
    const userId = req.body[0].user_id;
    const [error, response] = await addProduct(userId, productId);
    if (error) {
      return res.status(400).json({ error, status: false });
    }
    return res.json({
      status: true,
      message: `${productId} added into basket of the ${userId}`,
    });
  }
  return res.status(401).json({ error: "Invalid request body." });
});

module.exports = { basketRouter };
