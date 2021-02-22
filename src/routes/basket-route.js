const express = require("express");
const {
  addProductIntoBasket,
  getUserBasket,
  deleteProductFromBasket,
  getProductCountFromBasket,
  getProductPrice,
  getUserBasketDetails,
  clearBasket,
} = require("../db");

const basketRouter = express.Router();

basketRouter.get("/basket/:user_id", async (req, res) => {
  if (req.params && req.params.user_id) {
    const userId = req.params.user_id;

    const [error, response] = await getUserBasket(userId);
    if (error) {
      return res.status(400).json({ error, status: false });
    }
    console.log("basket", response);
    return res.json(response);
  }
  return res.status(400).json({ error: "Invalid URL query parameter." });
});

basketRouter.get("/basket_details/:user_id", async (req, res) => {
  if (req.params && req.params.user_id) {
    const userId = req.params.user_id;

    const [error, response] = await getUserBasketDetails(userId);
    if (error) {
      return res.status(400).json({ error, status: false });
    }
    return res.json(response);
  }
  return res.status(400).json({ error: "Invalid URL query parameter." });
});

// get count of products in basket
basketRouter.get("/basket/count/:product_id", async (req, res) => {
  if (req.params && req.params.product_id && req.body && req.body[0].user_id) {
    const userId = req.body[0].user_id;
    const prodId = req.params.product_id;

    let [error, response] = await getProductCountFromBasket(userId, prodId);
    if (error) {
      return res.status(400).json({ error, status: false });
    }

    const count = response[0].count;
    [error, response] = await getProductPrice(prodId);
    if (error) {
      return res.json({
        status: true,
        count,
        product_price: false,
      });
    }

    return res.json({
      status: true,
      count,
      product_price: response[0].UnitPrice,
    });
  }
  return res.status(400).json({ error: "Invalid query parameter or body." });
});

basketRouter.post("/clear_basket/:user_id", async (req, res) => {
  if (req.params && req.params.user_id) {
    const userId = req.params.user_id;
    const [error] = await clearBasket(userId);

    if (error) {
      return res.status(400).json({ error, status: false });
    }

    return res.json({
      status: true,
      user_id: userId,
    });
  }
  return res.status(400).json({ error: "Invalid request body." });
});
basketRouter.post("/add/:product_id", async (req, res) => {
  if (req.body && req.body) {
    const productId = req.params.product_id;
    const userId = req.body.user_id;
    const [error] = await addProductIntoBasket(userId, productId);

    if (error) {
      return res.status(400).json({ error, status: false });
    }

    return res.json({
      status: true,
      message: `${productId} added into basket of user:${userId}`,
      product_id: productId,
      user_id: userId,
    });
  }
  return res.status(400).json({ error: "Invalid request body." });
});

basketRouter.delete("/product/:product_id", async (req, res) => {
  console.log("req body", req.body);
  if (req.params && req.params.product_id && req.body && req.body.user_id) {
    const userId = req.body.user_id;
    const productId = req.params.product_id;
    console.log(`user ${userId} productId ${productId}`);

    const [error, response] = await deleteProductFromBasket(userId, productId);
    if (error) {
      return res.status(400).json({ error, status: false });
    }

    console.log(response);
    if (response.affectedRows > 0) {
      return res.json({
        status: true,
        message: `product:${productId} is deleted from basket of user with id:${userId}.`,
      });
    }

    return res.json({
      status: false,
      message: `Either user or product not exist on the basket db.`,
    });
  }
  return res
    .status(400)
    .json({ error: "Invalid URL query parameter or request body." });
});

module.exports = { basketRouter };
