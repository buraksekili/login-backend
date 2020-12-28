const express = require("express");
const manipRouter = express.Router();
const {
  passwordChange,
  getUserIdFromMail,
  updateProfile,
  getAllUsers,
} = require("../db");

// manipRouter.post("/user/:id/change", async (req, res) => {
//   if (req.body && req.body[0]) {
//     const [error, response] = await passwordChange(
//       req.params.id,
//       req.body[0].password
//     );

//     if (error) {
//       return res.status(400).json({ error, status: false });
//     }
//     if (response && response.affectedRows !== 0) {
//       return res.json({
//         user_id: req.params.id,
//         status: true,
//         message: `The password of the user with id ${req.params.id} changed`,
//       });
//     }
//   }
//   return res.status(400).json({ error: "Invalid request body." });
// });

manipRouter.get("/allusers", async (req, res) => {
  const [error, response] = await getAllUsers();
  if (error) {
    return res.status(400).json({ error, status: false });
  }
  if (response) {
    return res.json(response);
  }
  return res.status(400).json({ error: "Invalid request" });
});

manipRouter.post("/update/user/:user_id", async (req, res) => {
  if (req.body && req.body) {
    console.log(req.params.user_id, req.body.Password);
    const [error, response] = await updateProfile(
      req.params.user_id,
      req.body.Password
    );

    console.log("response", response);
    if (error) {
      return res.status(400).json({ error, status: false });
    }
    if (response && response.affectedRows !== 0) {
      console.log("UPDATED");
      return res.json({
        user_id: req.params.id,
        status: true,
      });
    }
  }
  return res.status(400).json({ error: "Invalid request body." });
});

// manipRouter.get("/user/mail", async (req, res) => {
//   if (req.body && req.body[0]) {
//     const userMail = req.body[0].user_mail;
//     const [error, response] = await getUserIdFromMail(userMail);
//     if (error) {
//       return res.status(400).json({ status: false, error });
//     }
//     console.log("response", response);
//     return res.json({ status: true, user_mail: userMail, user_id: response });
//   }
//   return res.status(400).json({ error: "Invalid request body." });
// });

module.exports = { manipRouter };
