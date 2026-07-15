const jwt = require("jsonwebtoken");

// Verify JWT Token
const verifyToken = (req, res, next) => {
  try {
    console.log("Headers:", req.headers);

    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "Access Denied. No Token Provided",
      });
    }

    const actualToken = token.split(" ")[1];

    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      message: "Invalid Token",
    });
  }
};

// Verify Admin
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin Access Only",
    });
  }

  next();
};

// Verify Owner
const verifyOwner = (req, res, next) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({
      message: "Owner Access Only",
    });
  }

  next();
};

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyOwner,
};