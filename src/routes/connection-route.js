const express = require("express");
const { login, signup, addCustomer, addEmployee } = require("../db");

const connectionRouter = express.Router();

connectionRouter.post("/login", async (req, res) => {
  if (req.body && req.body[0]) {
    const { mail, password, title } = req.body[0];

    const [error, response] = await login(mail, password, title);

    if (error) {
      return res.status(401).json({ status: false, error });
    }

    if (response && response.length > 0) {
      return res.json({
        status: true,
        user_id: response[0].ID,
        user_mail: response[0].LoginnerMail,
        user_title: response[0].Title,
      });
    }
  }
  return res.status(400).json({ error: "Invalid request body." });
});

connectionRouter.post("/signup", async (req, res) => {
  console.log("Signup function");
  if (req.body && req.body[0]) {
    const { mail, password, phone, title, contactName } = req.body[0];
    let userTitle = title;
    if (title == "S" || title == "P") {
      console.log("New user is an employee");
      userTitle = "E";
    }
    // add into loginners
    const [error, response] = await signup(mail, password, phone, userTitle);

    if (error) {
      return res.status(400).json({ error, status: false });
    }

    console.log("Succesfully inserted into loginners table");
    if (response && response.affectedRows && response.affectedRows > 0) {
      const loginnerId = response.insertId;
      // if Customer signs up
      if (userTitle == "C") {
        console.log("New user is a customer");
        const { customerAddress, creditCardNo, city, postalCode } = req.body[0];

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

      const { firstname, lastname, hiredate, postalCode, title } = req.body[0];

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
