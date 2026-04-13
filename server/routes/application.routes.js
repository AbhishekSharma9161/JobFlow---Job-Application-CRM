const express = require("express");
const router = express.Router();
const {
  getApplications,
  createApplication,
  getApplication,
  updateApplication,
  deleteApplication,
  updateStatus,
  getReminders,
  getStats,
} = require("../controllers/application.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);

router.get("/stats", getStats);
router.get("/reminders", getReminders);
router.route("/").get(getApplications).post(createApplication);
router.route("/:id").get(getApplication).put(updateApplication).delete(deleteApplication);
router.patch("/:id/status", updateStatus);

module.exports = router;
