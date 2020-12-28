const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createProduct,
  createCategory,
  getCategories,
  getProducts,
  getProductsByID,
  getProductPrice,
  updateProductDetail,
  deleteProduct,
} = require("../db");
const { getArrayFromBuffer } = require("../helper");

var imagePath = "";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    var catImageName = Date.now() + file.originalname;
    cb(null, catImageName);
    imagePath = path.join(__dirname, "../../uploads", catImageName);
    console.log("filepath is ", imagePath);
  },
});

const upload = multer({ storage });
const productRouter = express.Router();

productRouter.post("/add_cat", upload.single("catImage"), async (req, res) => {
  const { catName, userTitle } = req.body;
  if (req.body && catName && userTitle) {
    if (userTitle != "E") {
      const error = "You must be an employee to add category";
      return res.status(401).json({ status: false, error });
    }

    const [error, response] = await createCategory(catName, imagePath, 1);

    if (error) {
      return res.status(401).json({ status: false, error });
    }

    if (response && response.affectedRows > 0) {
      return res.json({
        status: true,
        cat_id: response.insertId,
        cat_name: catName,
      });
    }
  }
  return res.status(400).json({ error: "Invalid request body." });
});

productRouter.get("/get_cats", async (req, res) => {
  const [error, response] = await getCategories();
  if (error) {
    return res.status(401).json({ status: false, error });
  }

  if (response) {
    getArrayFromBuffer(response);
    return res.json(response);
  }
  return res.status(400).json({ error: "Invalid request to /get_cats." });
});

productRouter.post(
  "/update_product",
  upload.single("productImage"),
  async (req, res) => {
    const {
      title,
      categoryId,
      productName,
      unitPrice,
      status,
      productId,
    } = req.body;
    if (req.body) {
      if (title != "P") {
        const error = "You must be an employee to add category";
        return res.status(401).json({ status: false, error });
      }

      const [error, response] = await updateProductDetail(
        productId,
        productName,
        imagePath,
        categoryId,
        unitPrice,
        status
      );

      if (error) {
        return res.status(401).json({ status: false, error });
      }
      if (response && response.affectedRows > 0) {
        return res.json({ status: true });
      }
    }
    return res.status(400).json({ error: "Invalid request body." });
  }
);

productRouter.post(
  "/create_product",
  upload.single("productImage"),
  async (req, res) => {
    const { title, categoryId, productName, unitPrice, status } = req.body;
    if (req.body) {
      console.log({ title, categoryId, productName, unitPrice, status });
      if (title != "E") {
        const error = "You must be an employee to add category";
        return res.status(401).json({ status: false, error });
      }
      console.log("paramters are ", {
        title,
        categoryId,
        productName,
        unitPrice,
        status,
      });

      const [error, response] = await createProduct(
        categoryId,
        productName,
        unitPrice,
        imagePath,
        status
      );

      if (error) {
        return res.status(401).json({ status: false, error });
      }

      if (response && response.rows && response.rows.affectedRows > 0) {
        return res.json({
          status: true,
          prod_id: response.rows.insertId,
          prod_name: productName,
          category_name: response.categoryName,
          category_id: response.categoryID,
        });
      }
    }
    return res.status(400).json({ error: "Invalid request body." });
  }
);

productRouter.get("/products", async (req, res) => {
  let categoryId = -1;
  if (req.query && req.query.categoryId) {
    categoryId = req.query.categoryId;
    console.log("req.query", req.query.categoryId);
  }
  const [error, response] = await getProducts(categoryId);
  if (error) {
    return res.status(401).json({ status: false, error });
  }

  if (response) {
    return res.json(response);
  }

  return res.status(400).json({ error: "Invalid request to /get_cats." });
});

productRouter.get("/price/:product_id", async (req, res) => {
  if (req.params && req.params.product_id) {
    const productId = req.params.product_id;
    const [error, response] = await getProductPrice(productId);

    if (error) {
      return res.status(401).json({ status: false, error });
    }

    if (response) {
      return res.json(response);
    }
  }
  return res.status(400).json({ error: "Invalid request to /get_cats." });
});

productRouter.get("/product/:id", async (req, res) => {
  const productId = req.params.id;
  if (!productId || productId.toString() < 0) {
    return res.status(400).json({ error: "Invalid ID parameter." });
  }
  const [error, response] = await getProductsByID(productId);
  if (error) {
    return res.status(401).json({ status: false, error });
  }

  if (response) {
    // getArrayFromBuffer(response);
    console.log("wow product", response);
    return res.json(response);
  }
  return res.status(400).json({ error: "Invalid request to /get_cats." });
});

productRouter.delete("/product", async (req, res) => {
  console.log("router");
  const productId = req.body.id;
  if (!productId) {
    return res.status(400).json({ error: "Invalid ID parameter." });
  }
  const [error, response] = await deleteProduct(productId);
  if (error) {
    return res.status(401).json({ status: false, error });
  }

  if (response) {
    // getArrayFromBuffer(response);
    console.log("wow deleted", response);
    return res.json(response);
  }
  return res.status(400).json({ error: "Invalid request to /get_cats." });
});

module.exports = { productRouter };
