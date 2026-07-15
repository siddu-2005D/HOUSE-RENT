const express = require("express");
const router = express.Router();

const {
  createBooking,
  myBookings,
  cancelBooking,
  getOwnerBookings,
  updateBookingStatus,
} = require("../controllers/bookingController");

const { verifyToken, verifyOwner } = require("../middlewares/authMiddleware");

// Renter Routes
router.post("/create", verifyToken, createBooking);
router.get("/my-bookings", verifyToken, myBookings);
router.delete("/cancel/:id", verifyToken, cancelBooking);

// Owner Routes
router.get("/owner", verifyToken, verifyOwner, getOwnerBookings);
router.put("/status/:id", verifyToken, verifyOwner, updateBookingStatus);

module.exports = router;