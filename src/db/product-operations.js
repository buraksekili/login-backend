const mysql = require("mysql2/promise");
const { getProductRanks } = require("./ranks-operations");
const { connectionPool } = require("../config");

const createCategory = async (categoryName, categoryImagePath, status) => {
  try {
    const connection = await connectionPool.getConnection();

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
    const connection = await connectionPool.getConnection();

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

const getProductRate = async (productId) => {
  const [error, response] = await getProductRanks(productId);
  if (error) {
    return 0;
  }
  if (response[0].Rating) {
    return parseFloat(response[0].Rating);
  }
  return 0;
};

const sortProductByPrice = async (categoryId, sorting) => {
  let sort = "";
  let orderBy = "";
  if (sorting == "AP") {
    sort = "asc";
    orderBy = "UnitPrice";
  } else if (sorting == "DP") {
    sort = "desc";
    orderBy = "UnitPrice";
  } else {
    return ["Invalid sorting params", undefined];
  }

  try {
    const connection = await connectionPool.getConnection();
    let SQL;
    let rows;
    if (categoryId >= 0) {
      SQL = `SELECT * FROM products p 
             WHERE p.CategoryID=? 
             order by ${orderBy} ${sort}`;
      [rows] = await connection.execute(SQL, [categoryId]);
    } else {
      SQL = `SELECT * FROM products p 
             order by ${orderBy} ${sort}`;
      [rows] = await connection.execute(SQL);
    }

    if (rows) {
      const promiseResult = rows.map(async (product) => ({
        ...product,
        rank: await getProductRate(product.ProductID),
      }));
      const resultArray = await Promise.all(promiseResult);
      return [undefined, resultArray];
    }
    return ["Could not get categories", undefined];
  } catch (error) {
    return [error.message, undefined];
  }
};

const getProducts = async (categoryId) => {
  try {
    let connection = await connectionPool.getConnection();
    let SQL;
    let rows;
    if (categoryId >= 0) {
      SQL = "SELECT * FROM products p WHERE p.CategoryID=? ";
      [rows] = await connection.execute(SQL, [categoryId]);
      console.log("getting products4");
    } else {
      const SQL = "SELECT * FROM products";
      [rows] = await connection.execute(SQL);
    }

    if (rows) {
      const promiseResult = rows.map(async (product) => ({
        ...product,
        rank: await getProductRate(product.ProductID),
      }));
      const resultArray = await Promise.all(promiseResult);
      connection.release();
      return [undefined, resultArray];
    }
    return ["Could not get categories", undefined];
  } catch (error) {
    connection.end();
    return [error.message, undefined];
  }
};

const getProductsByProductId = async (productId) => {
  try {
    const connection = await connectionPool.getConnection();
    const SQL = "SELECT * FROM products WHERE ProductID=? ";
    const [rows] = await connection.execute(SQL, [productId]);

    if (rows) {
      const promiseResult = rows.map(async (product) => ({
        ...product,
        rank: await getProductRate(product.ProductID),
      }));
      const resultArray = await Promise.all(promiseResult);
      return [undefined, resultArray];
    }
    return ["Could not get products", undefined];
  } catch (error) {
    return [error.message, undefined];
  }
};

const getProductsByID = async (productId) => {
  try {
    const connection = await connectionPool.getConnection();

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

const updateProductDetail = async (
  productId,
  productName,
  imagePath,
  categoryId,
  unitPrice,
  status
) => {
  try {
    const connection = await connectionPool.getConnection();
    let SQL;

    SQL = `UPDATE products 
    SET ProductName=?, CategoryID=?, UnitPrice=?, ProductImage=?, Active_Passive=? 
    WHERE ProductID=?`;
    const [rows] = await connection.execute(SQL, [
      productName,
      categoryId,
      unitPrice,
      imagePath,
      status,
      productId,
    ]);

    if (rows) {
      return [undefined, rows];
    }
    return ["Could not updated", undefined];
  } catch (error) {
    return [error.message, undefined];
  }
};
const getProductPrice = async (productId) => {
  try {
    const connection = await connectionPool.getConnection();

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
  categoryId,
  productName,
  unitPrice,
  productImage,
  status
) => {
  try {
    const connection = await connectionPool.getConnection();
    var SQL = "SELECT C.CategoryName FROM categories C WHERE C.CategoryID  = ?";
    const [rowsId] = await connection.execute(SQL, [categoryId]);
    const categoryName = rowsId[0].CategoryName;
    SQL =
      "INSERT INTO Products(ProductName, CategoryID, UnitPrice, ProductImage, Active_Passive) VALUES (?, ?, ?, ?, ?)";
    const [rows] = await connection.execute(SQL, [
      productName,
      categoryId,
      unitPrice,
      productImage,
      parseFloat(status),
    ]);

    // succ
    if (rows && rows.affectedRows && rows.affectedRows > 0) {
      return [undefined, { rows, categoryName }];
    }

    return ["Error while adding product into a basket", undefined];
  } catch (error) {
    return [error.message, undefined];
  }
};

const deleteProduct = async (productId) => {
  try {
    const connection = await connectionPool.getConnection();
    const SQL = "DELETE from products where ProductID=?;";
    const [rows] = await connection.execute(SQL, [productId]);

    console.log("rows delete", rows);
    // succ
    if (rows && rows.affectedRows && rows.affectedRows > 0) {
      return [undefined, rows];
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
  deleteProduct,
  updateProductDetail,
  getProductsByProductId,
  sortProductByPrice,
};
