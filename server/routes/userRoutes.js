const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getAllProperties,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/properties", getAllProperties);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;