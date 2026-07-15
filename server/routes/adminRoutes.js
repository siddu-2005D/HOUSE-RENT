const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getAllProperties,
  getAllBookings,
  deleteUser,
  deleteProperty,
  deleteBooking,
} = require("../controllers/adminController");

const {
  verifyToken,
  verifyAdmin,
} = require("../middlewares/authMiddleware");

router.get("/users", verifyToken, verifyAdmin, getAllUsers);

router.get("/properties", verifyToken, verifyAdmin, getAllProperties);

router.get("/bookings", verifyToken, verifyAdmin, getAllBookings);

router.delete("/user/:id", verifyToken, verifyAdmin, deleteUser);

router.delete("/property/:id", verifyToken, verifyAdmin, deleteProperty);

router.delete("/booking/:id", verifyToken, verifyAdmin, deleteBooking);

module.exports = router;
