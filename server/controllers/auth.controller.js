const User = require("../models/User.model");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");
const { ApiError, ApiResponse } = require("../utils/ApiHelpers");
const jwt = require("jsonwebtoken");

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return next(new ApiError(400, "All fields required"));

  const exists = await User.findOne({ email });
  if (exists) return next(new ApiError(409, "Email already registered"));

  const user = await User.create({ name, email, password });
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

  res.status(201).json(new ApiResponse(201, { user, accessToken }, "Registered successfully"));
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new ApiError(400, "Email and password required"));

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return next(new ApiError(401, "Invalid credentials"));

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

  res.json(new ApiResponse(200, { user, accessToken }, "Login successful"));
};

const logout = async (req, res) => {
  res.clearCookie("refreshToken");
  res.json(new ApiResponse(200, null, "Logged out"));
};

const refreshToken = async (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) return next(new ApiError(401, "No refresh token"));
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return next(new ApiError(401, "User not found"));
    const accessToken = generateAccessToken(user._id);
    res.json(new ApiResponse(200, { accessToken }, "Token refreshed"));
  } catch {
    return next(new ApiError(401, "Refresh token invalid"));
  }
};

const getMe = async (req, res) => {
  res.json(new ApiResponse(200, req.user));
};

module.exports = { register, login, logout, refreshToken, getMe };
