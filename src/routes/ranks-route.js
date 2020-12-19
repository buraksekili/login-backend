const express = require("express");
const { addRank, getProductRanks } = require("../db");
const { getArrayFromBuffer } = require("../helper");

const ranksRoute = express.Router();

// get ranks based on product id
ranksRoute.get("/ranks/:product_id", async (req, res) => {
  if (req.params && req.params.product_id) {
    const [error, response] = await getProductRanks(req.params.product_id);
    if (error) {
      return res.status(400).json({ error, status: false });
    }

    if (response) {
      const sum = response[0].sum;
      const count = response[0].count;
      if (!sum || count == 0) {
        return res.json({ status: false, star_sum: sum, star_count: count });
      }
      return res.json({ status: true, star_sum: sum, star_count: count });
    }
    return res.status(400).json({ error: "Invalid request to GET /orders." });
  }
  return res.status(400).json({ error: "Invalid URL query parameter." });
});

ranksRoute.get("/orderdetails/:order_id", async (req, res) => {
  if (req.params && req.params.order_id) {
    const [error, response] = await getOrders(req.params.user_id);
    if (error) {
      return res.status(400).json({ error, status: false });
    }
    if (response) {
      getArrayFromBuffer(response);
      return res.json(response);
    }
    return res.status(400).json({ error: "Invalid request to GET /orders." });
  }
  return res.status(400).json({ error: "Invalid URL query parameter." });
});

ranksRoute.get("/count/:order_id/:product_id", async (req, res) => {
  if (req.params && req.params.product_id && req.params.order_id) {
    const productId = req.params.product_id;
    const orderId = req.params.order_id;

    let [error, response] = await productCountsFromOrder(productId, orderId);
    if (error) {
      return res.status(400).json({ error, status: false });
    }
    const count = response[0].c;

    [error, response] = await getProductPrice(productId);
    return res.json({
      status: true,
      count,
      order_id: orderId,
      product_id: productId,
      product_price: response[0].UnitPrice,
    });
  }
  return res.status(400).json({ error: "Invalid URL query parameter." });
});

ranksRoute.post("/rank", async (req, res) => {
  if (req.body && req.body[0]) {
    const userId = req.body[0].user_id;
    const productId = req.body[0].product_id;
    const star = req.body[0].star;
    const [error, response] = await addRank(userId, productId, star);

    if (error) {
      return res.status(400).json({ error, status: false });
    }

    if (response && response.affectedRows > 0) {
      return res.json({
        status: true,
        ranks_line_id: response.insertId,
      });
    }
  }
  return res.status(401).json({ error: "Invalid request body." });
});

ranksRoute.post("/orderdetail", async (req, res) => {
  if (req.body && req.body[0]) {
    const orderId = req.body[0].order_id;
    const productId = req.body[0].product_id;
    const [error, response] = await createOrderDetails(orderId, productId);

    if (error) {
      return res.status(400).json({ error, status: false });
    }

    return res.json({
      status: true,
      message: `orderdetail:${response.insertId} is added for order id:${orderId}.`,
      order_id: orderId,
      orderdetail_id: response.insertId,
    });
  }
  return res.status(401).json({ error: "Invalid request body." });
});

// delete product from the basket
ranksRoute.delete("/order/:order_id", async (req, res) => {
  const orderId = req.params.order_id;
  if (req.params && orderId && req.body[0].user_id) {
    const userId = req.body[0].user_id;

    const [error, response] = await deleteOrder(userId, orderId);
    if (error) {
      return res.status(400).json({ error, status: false });
    }

    if (response.affectedRows > 0) {
      return res.json({
        status: true,
        message: `order:${orderId} is deleted by SM:${userId}`,
      });
    }

    return res.json({ status: false, message: `Order could not deleted.` });
  }
  return res
    .status(400)
    .json({ error: "Invalid URL query parameter or request body." });
});

module.exports = { ranksRoute };
