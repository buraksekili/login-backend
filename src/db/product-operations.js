const mysql = require("mysql2/promise");
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = require("../config");

// Set the connection config object
const connectionConfig = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  multipleStatements: true,
};

const createCategory = async (categoryName, categoryImagePath, status) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);

    // const image = await fs.readFile(categoryImagePath, { encoding: "base64" });
    // const SQL = `INSERT INTO categories (CategoryName, CategoryImage, Active_Passive) VALUES(?, ?, ?)`;

    const SQL = `INSERT INTO categories (CategoryName, CategoryImage, Active_Passive) VALUES(?, ?, ?)`;
    const [rows] = await connection.execute(SQL, [
      categoryName,
      categoryImagePath,
      status,
    ]);

    if (rows && rows.affectedRows && rows.affectedRows > 0) {
      return [undefined, rows];
    }
    return ["Error while adding product into a basket", undefined];
  } catch (error) {
    return [error.message, undefined];
  }
};

const getCategories = async () => {
  try {
    const connection = await mysql.createConnection(connectionConfig);

    const SQL = "SELECT * FROM categories";
    const [rows] = await connection.execute(SQL);

    if (rows) {
      return [undefined, rows];
    }
    return ["Could not get categories", undefined];
  } catch (error) {
    return [error.message, undefined];
  }
};

const getProducts = async () => {
  try {
    const connection = await mysql.createConnection(connectionConfig);

    const SQL = "SELECT * FROM products";
    const [rows] = await connection.execute(SQL);

    if (rows) {
      return [undefined, rows];
    }
    return ["Could not get categories", undefined];
  } catch (error) {
    return [error.message, undefined];
  }
};

const getProductsByID = async (productId) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);

    const SQL = "SELECT * FROM products WHERE ProductID=?";
    const [rows] = await connection.execute(SQL, [productId]);

    if (rows) {
      return [undefined, rows];
    }
    return ["Could not get categories", undefined];
  } catch (error) {
    return [error.message, undefined];
  }
};

const getProductPrice = async (productId) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);

    const SQL = "SELECT UnitPrice FROM products WHERE ProductID=?";
    const [rows] = await connection.execute(SQL, [productId]);

    if (rows) {
      return [undefined, rows];
    }
    return ["Could not get categories", undefined];
  } catch (error) {
    return [error.message, undefined];
  }
};

const createProduct = async (
  categoryName,
  productName,
  unitPrice,
  productImage,
  status
) => {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    var SQL = "SELECT C.CategoryID FROM categories C WHERE C.CategoryName = ?";
    const [rowsId] = await connection.execute(SQL, [categoryName]);
    const categoryID = rowsId[0].CategoryID;
    SQL =
      "INSERT INTO Products(ProductName, CategoryID, UnitPrice, ProductImage, Active_Passive) VALUES (?, ?, ?, ?, ?)";
    console.log(`status ${status}`);
    const [rows] = await connection.execute(SQL, [
      productName,
      categoryID,
      unitPrice,
      productImage,
      parseFloat(status),
    ]);

    // succ
    if (rows && rows.affectedRows && rows.affectedRows > 0) {
      return [undefined, { rows, categoryID }];
    }

    return ["Error while adding product into a basket", undefined];
  } catch (error) {
    return [error.message, undefined];
  }
};

module.exports = {
  createProduct,
  getCategories,
  createCategory,
  getProducts,
  getProductPrice,
  getProductsByID,
};
