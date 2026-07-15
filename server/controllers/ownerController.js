const Property = require("../models/PropertySchema");
const Booking = require("../models/BookingSchema");
const fs = require("fs");
const path = require("path");

// Add Property
exports.addProperty = async (req, res) => {
  try {
    const propertyData = { ...req.body };
    
    // Parse numeric fields if they are sent as strings from FormData
    if (propertyData.price) propertyData.price = Number(propertyData.price);
    if (propertyData.bedrooms) propertyData.bedrooms = Number(propertyData.bedrooms);
    if (propertyData.bathrooms) propertyData.bathrooms = Number(propertyData.bathrooms);

    if (req.file) {
      propertyData.image = `/uploads/${req.file.filename}`;
    }

    const property = await Property.create({
      ...propertyData,
      owner: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Property Added Successfully",
      property,
    });
  } catch (error) {
    // Delete uploaded image if creation failed
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Failed to delete temp file:", err);
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Property
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (property.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const propertyData = { ...req.body };

    // Parse numeric fields if they are sent as strings from FormData
    if (propertyData.price) propertyData.price = Number(propertyData.price);
    if (propertyData.bedrooms) propertyData.bedrooms = Number(propertyData.bedrooms);
    if (propertyData.bathrooms) propertyData.bathrooms = Number(propertyData.bathrooms);

    if (req.file) {
      propertyData.image = `/uploads/${req.file.filename}`;

      // Clean up previous image file if it exists
      if (property.image && property.image.startsWith("/uploads/")) {
        const oldPath = path.join(__dirname, "..", property.image);
        fs.unlink(oldPath, (err) => {
          if (err) console.error("Failed to delete old property image:", err.message);
        });
      }
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      propertyData,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Property Updated Successfully",
      property: updatedProperty,
    });
  } catch (error) {
    // Delete uploaded image if update failed
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Failed to delete temp file:", err);
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Property
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (property.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Clean up image file in uploads/
    if (property.image && property.image.startsWith("/uploads/")) {
      const imgPath = path.join(__dirname, "..", property.image);
      fs.unlink(imgPath, (err) => {
        if (err) console.error("Failed to delete property image file:", err.message);
      });
    }

    // Cascade delete bookings associated with this property
    await Booking.deleteMany({ property: req.params.id });

    // Delete property itself
    await Property.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Property and associated bookings deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// My Properties
exports.myProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.id });

    return res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};