const Application = require("../models/Application.model");
const { ApiError, ApiResponse } = require("../utils/ApiHelpers");

const getApplications = async (req, res) => {
  const { status, source, search, sortBy = "createdAt", order = "desc", page = 1, limit = 50 } = req.query;
  const query = { userId: req.user._id };

  if (status) query.status = status;
  if (source) query.source = source;
  if (search) {
    query.$or = [
      { company: { $regex: search, $options: "i" } },
      { role: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  }

  const sortOrder = order === "asc" ? 1 : -1;
  const skip = (Number(page) - 1) * Number(limit);
  const total = await Application.countDocuments(query);
  const applications = await Application.find(query)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(Number(limit));

  res.json(new ApiResponse(200, { applications, total, page: Number(page), pages: Math.ceil(total / Number(limit)) }));
};

const createApplication = async (req, res, next) => {
  const { company, role } = req.body;
  if (!company || !role) return next(new ApiError(400, "Company and role are required"));
  const app = await Application.create({ ...req.body, userId: req.user._id });
  res.status(201).json(new ApiResponse(201, app, "Application created"));
};

const getApplication = async (req, res, next) => {
  const app = await Application.findOne({ _id: req.params.id, userId: req.user._id });
  if (!app) return next(new ApiError(404, "Application not found"));
  res.json(new ApiResponse(200, app));
};

const updateApplication = async (req, res, next) => {
  const app = await Application.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!app) return next(new ApiError(404, "Application not found"));
  res.json(new ApiResponse(200, app, "Application updated"));
};

const deleteApplication = async (req, res, next) => {
  const app = await Application.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!app) return next(new ApiError(404, "Application not found"));
  res.json(new ApiResponse(200, null, "Application deleted"));
};

const updateStatus = async (req, res, next) => {
  const { status } = req.body;
  if (!status) return next(new ApiError(400, "Status is required"));
  const app = await Application.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { status },
    { new: true }
  );
  if (!app) return next(new ApiError(404, "Application not found"));
  res.json(new ApiResponse(200, app, "Status updated"));
};

const getReminders = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [dueToday, overdue] = await Promise.all([
    Application.find({
      userId: req.user._id,
      followUpDone: false,
      followUpDate: { $gte: today, $lt: tomorrow },
    }),
    Application.find({
      userId: req.user._id,
      followUpDone: false,
      followUpDate: { $lt: today },
    }),
  ]);

  res.json(new ApiResponse(200, { dueToday, overdue }));
};

const getStats = async (req, res) => {
  const userId = req.user._id;

  const [statusDist, totalApps, last7Days] = await Promise.all([
    Application.aggregate([
      { $match: { userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Application.countDocuments({ userId }),
    Application.aggregate([
      {
        $match: {
          userId,
          appliedDate: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$appliedDate" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const statusMap = {};
  statusDist.forEach((s) => (statusMap[s._id] = s.count));

  const activePipeline = (statusMap["Applied"] || 0) +
    (statusMap["Phone Screen"] || 0) +
    (statusMap["Interview"] || 0) +
    (statusMap["Technical"] || 0);

  const offers = statusMap["Offer"] || 0;
  const rejected = statusMap["Rejected"] || 0;
  const responseRate = totalApps > 0
    ? Math.round(((activePipeline + offers + rejected) / totalApps) * 100)
    : 0;

  res.json(new ApiResponse(200, {
    total: totalApps,
    activePipeline,
    offers,
    responseRate,
    statusDistribution: statusDist,
    weeklyActivity: last7Days,
  }));
};

module.exports = {
  getApplications,
  createApplication,
  getApplication,
  updateApplication,
  deleteApplication,
  updateStatus,
  getReminders,
  getStats,
};
