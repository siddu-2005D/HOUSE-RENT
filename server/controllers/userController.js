const User = require("../models/UserSchema");
const Property = require("../models/PropertySchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// In-memory store for reset tokens (Email -> { token, expires })
const resetTokens = new Map();

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    // Remove password before sending user object
    user.password = undefined;

    return res.status(201).json({
      success: true,
      message: "Registration Successful",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET || "fallback_secret",
      {
        expiresIn: "1d",
      }
    );

    // Remove password before sending user object
    user.password = undefined;

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
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
      message: error.message,
    });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist",
      });
    }

    // Generate a 6-digit random code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store in memory with 10 minutes expiry
    resetTokens.set(email, {
      code: resetCode,
      expires: Date.now() + 10 * 60 * 1000,
    });

    console.log(`\n==========================================`);
    console.log(`🔑 PASSWORD RESET CODE FOR: ${email}`);
    console.log(`CODE: ${resetCode}`);
    console.log(`==========================================\n`);

    return res.status(200).json({
      success: true,
      message: "Reset code generated. Please check server console.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    const storedData = resetTokens.get(email);
    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: "No reset request found for this email",
      });
    }

    if (storedData.expires < Date.now()) {
      resetTokens.delete(email);
      return res.status(400).json({
        success: false,
        message: "Reset code expired",
      });
    }

    if (storedData.code !== code) {
      return res.status(400).json({
        success: false,
        message: "Invalid reset code",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Clean up reset code
    resetTokens.delete(email);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};