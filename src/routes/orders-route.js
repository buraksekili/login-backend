const express = require("express");
const {
  createOrder,
  createOrderDetails,
  getOrders,
  deleteOrder,
  productCountsFromOrder,
  getProductPrice,
  getOrderDetails,
  changeOrderStatus,
  getAllOrderDetails,
  makeGuestOrder,
} = require("../db");
const { getArrayFromBuffer } = require("../helper");

const orderRoute = express.Router();

// SELECT * FROM orderdetails o, orders o1 WHERE o.OrderID=o1.OrderID and LoginnerId = 45;

orderRoute.get("/orderdetails/all/:user_id", async (req, res) => {
  if (req.params && req.params.user_id) {
    const [error, response] = await getAllOrderDetails(req.params.user_id);
    if (error) {
      return res.status(400).json({ error, status: false });
    }
    if (response) {
      return res.json(response);
    }
    return res.status(400).json({ error: "Invalid request to GET /orders." });
  }
  return res.status(400).json({ error: "Invalid URL query parameter." });
});

orderRoute.get("/orders/:user_id", async (req, res) => {
  if (req.params && req.params.user_id) {
    const [error, response] = await getOrders(req.params.user_id);
    if (error) {
      return res.status(400).json({ error, status: false });
    }
    if (response) {
      return res.json(response);
    }
    return res.status(400).json({ error: "Invalid request to GET /orders." });
  }
  return res.status(400).json({ error: "Invalid URL query parameter." });
});

orderRoute.get("/orderdetails/:order_id", async (req, res) => {
  const orderId = req.params.order_id;
  if (req.params && orderId) {
    const [error, response] = await getOrderDetails(orderId);
    if (error) {
      return res.status(400).json({ error, status: false });
    }
    if (response) {
      return res.json(response);
    }
    return res.status(400).json({ error: "Invalid request to GET /orders." });
  }
  return res.status(400).json({ error: "Invalid URL query parameter." });
});

orderRoute.get("/count/:order_id/:product_id", async (req, res) => {
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
orderRoute.post("/guestOrder", async (req, res) => {
  if (req.body && req.body) {
    const {
      productId,
      guestMail,
      productName,
      unitPrice,
      productImage,
      status,
      orderDate,
      deliveryAddress,
    } = req.body;
    const [error, response] = await makeGuestOrder(
      productId,
      guestMail,
      productName,
      unitPrice,
      productImage,
      status,
      orderDate,
      deliveryAddress
    );
    if (error) {
      return res.status(400).json({ error, status: false });
    }
    return res.json({ status: true });
  }
  return res.status(401).json({ error: "Invalid request body." });
});

orderRoute.post("/order", async (req, res) => {
  if (req.body && req.body) {
    const userId = req.body.userId;
    const orderDate = req.body.orderDate;
    const status = req.body.status;
    const [error, response] = await createOrder(userId, orderDate, status);
    if (error) {
      return res.status(400).json({ error, status: false });
    }
    return res.json({
      status: true,
      user_id: userId,
      orderId: response.insertId,
      message: `order:${response.insertId} is added for user id:${userId}.`,
    });
  }
  return res.status(401).json({ error: "Invalid request body." });
});

orderRoute.post("/changeOrder", async (req, res) => {
  if (req.body && req.body.orderId && req.body.loginnerId) {
    const { orderId, loginnerId, status } = req.body;
    const [error, response] = await changeOrderStatus(
      orderId,
      loginnerId,
      status
    );
    if (error) {
      return res.status(400).json({ error, status: false });
    }

    if (response && response.affectedRows && response.affectedRows > 0) {
      return res.json({ status: true });
    }

    return res.status(401).json({ error: "Couln't update", status: false });
  }
  return res.status(401).json({ error: "Invalid body" });
});

orderRoute.post("/orderdetail", async (req, res) => {
  if (req.body) {
    const orderId = req.body.orderId;
    const productId = req.body.productId;
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

orderRoute.delete("/order/:order_id", async (req, res) => {
  const orderId = req.params.order_id;
  if (req.params && orderId && req.body && req.body.user_id) {
    const userId = req.body.user_id;

    const [error, response] = await deleteOrder(orderId);
    if (error) {
      return res.status(400).json({ error, status: false });
    }

    if (response && response.affectedRows > 0) {
      return res.json({ status: true });
    }

    return res.json({ status: false, message: `Order could not deleted.` });
  }
  return res
    .status(400)
    .json({ error: "Invalid URL query parameter or request body." });
});

module.exports = { orderRoute };
