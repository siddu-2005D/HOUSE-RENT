const User = require("../models/UserSchema");
const Booking = require("../models/BookingSchema");
const Property = require("../models/PropertySchema");

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users: " + error.message,
    });
  }
};

// Get All Bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email role")
      .populate("property", "title location price");
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings: " + error.message,
    });
  }
};

// Get All Properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate("owner", "name email role");
    return res.status(200).json(properties);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch properties: " + error.message,
    });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent deletion of current admin
    if (user.role === "admin" && req.user.id === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account",
      });
    }

    // Delete user
    await User.findByIdAndDelete(id);
    
    // Cascade delete user's bookings and properties (optional but recommended for data consistency)
    await Booking.deleteMany({ user: id });
    await Property.deleteMany({ owner: id });

    return res.status(200).json({
      success: true,
      message: "User and all associated properties/bookings deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete user: " + error.message,
    });
  }
};

// Delete Property
exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    await Property.findByIdAndDelete(id);
    
    // Clean up bookings associated with this property
    await Booking.deleteMany({ property: id });

    return res.status(200).json({
      success: true,
      message: "Property and associated bookings deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete property: " + error.message,
    });
  }
};

// Delete Booking
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    await Booking.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Booking record deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete booking: " + error.message,
    });
  }
};
