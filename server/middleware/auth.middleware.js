const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { ApiError } = require("../utils/ApiHelpers");

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Not authorized, no token"));
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return next(new ApiError(401, "User not found"));
    next();
  } catch (err) {
    return next(new ApiError(401, "Token invalid or expired"));
  }
};

module.exports = { protect };
