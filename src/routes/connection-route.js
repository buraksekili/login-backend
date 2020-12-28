const express = require("express");
const {
  login,
  signup,
  addCustomer,
  addEmployee,
  getUserById,
} = require("../db");

const connectionRouter = express.Router();

connectionRouter.get("/getUser/:userId", async (req, res) => {
  if (req.params && req.params.userId) {
    const userId = req.params.userId;
    const [error, result] = await getUserById(userId);

    if (error) {
      return res.status(401).json({ status: false, error });
    }
    if (result) {
      return res.json({ status: true, result });
    }
  }
  return res.status(400).json({ error: "Invalid request params" });
});

connectionRouter.post("/login", async (req, res) => {
  if (req.body) {
    const { mail, password } = req.body;
    const [error, result] = await login(mail, password);

    if (error) {
      return res.status(401).json({ status: false, error });
    }
    if (result) {
      return res.json({
        status: true,
        user_mail: mail,
        userId: result.ID,
        title: result.title,
      });
    }
    return res.json({
      status: false,
      message: "Invalid credentials",
      userId: result.userId,
      user_mail: mail,
      title: result.title,
    });
  }
  return res
    .status(400)
    .json({ status: false, error: "Invalid request body." });
});

connectionRouter.post("/signup", async (req, res) => {
  if (req.body && req.body) {
    const { mail, password, phone, title, contactName } = req.body;
    if (
      mail.trim() === "" ||
      password.trim() === "" ||
      phone.trim() === "" ||
      title.trim() === ""
    ) {
      return res
        .status(401)
        .json({ error: "Invalid credentials", status: false });
    }
    let userTitle = title;
    if (title == "Customer") {
      userTitle = "C";
    }
    if (title == "S" || title == "P") {
      console.log("New user is an employee");
      userTitle = "E";
    }
    // add into loginners
    console.log("signup", { mail, password, phone, userTitle });
    const [error, response] = await signup(mail, password, phone, userTitle);

    if (error) {
      return res.status(400).json({ error, status: false });
    }
    console.log("error");

    console.log("Succesfully inserted into loginners table");
    if (response && response.affectedRows && response.affectedRows > 0) {
      const loginnerId = response.insertId;
      // if Customer signs up
      if (userTitle == "C") {
        console.log("New user is a customer");
        const { customerAddress, creditCardNo, city, postalCode } = req.body;

        // add into customerloginners
        const [err, resp] = await addCustomer(
          loginnerId,
          contactName,
          customerAddress,
          creditCardNo,
          city,
          postalCode
        );
        if (err) {
          return res.status(400).json({ error: err, status: false });
        }
        console.log("Customer succesfully inserted into customer table.");
        return res.json({
          status: true,
          customer_id: loginnerId,
          customer_name: contactName,
        });
      }

      const { firstname, lastname, hiredate, postalCode, title } = req.body;

      // add into employee
      const [err, resp] = await addEmployee(
        loginnerId,
        firstname,
        lastname,
        hiredate,
        postalCode,
        title
      );

      if (err) {
        return res.status(400).json({ error: err, status: false });
      }
      return res.json({
        status: true,
        employee_id: loginnerId,
        employee_firstname: firstname,
        employee_lastname: lastname,
      });
    }
  }
  // invalid json body.
  return res.status(400).json({ error: "Invalid request body." });
});

module.exports = { connectionRouter };
