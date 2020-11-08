const express = require("express");
const { addProduct, getBasket, deleteProductFromBasket } = require("../db");

const basketRouter = express.Router();

basketRouter.post("/add/:product_id", async (req, res) => {
  if (req.body && req.body[0]) {
    const productId = req.params.product_id;
    const userId = req.body[0].user_id;
    const [error] = await addProduct(userId, productId);

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

// checks if the user also exists in user table
basketRouter.get("/basket/:user_id", async (req, res) => {
  if (req.params && req.params.user_id) {
    const userId = req.params.user_id;

    const [error, response] = await getBasket(userId);
    if (error) {
      return res.status(400).json({ error, status: false });
    }
    return res.json(response);
  }
  return res.status(401).json({ error: "Invalid URL query." });
});

basketRouter.delete("/delete/:product_id", async (req, res) => {
  if (req.params && req.params.product_id && req.body && req.body[0]) {
    const userId = req.body[0].user_id;
    const productId = req.params.product_id;

    const [error, response] = await deleteProductFromBasket(userId, productId);
    if (error) {
      return res.status(400).json({ error, status: false });
    }

    if (response.affectedRows > 0) {
      return res.json({
        status: true,
        message: `${productId} product is deleted from ${userId}'s basket.`,
      });
    }

    return res.json({
      status: false,
      message: `Either user or product not exist on the basket db.`,
    });
  }
  return res.status(401).json({ error: "Invalid URL query." });
});

module.exports = { basketRouter };
