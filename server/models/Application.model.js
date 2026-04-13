const mongoose = require("mongoose");

const STATUS_ENUM = [
  "Wishlist",
  "Applied",
  "Phone Screen",
  "Interview",
  "Technical",
  "Offer",
  "Rejected",
  "Ghosted",
  "Withdrawn",
];

const SOURCE_ENUM = [
  "LinkedIn",
  "Indeed",
  "Company Website",
  "Referral",
  "Naukri",
  "AngelList",
  "Other",
];

const applicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    jobUrl: { type: String, default: "" },
    location: { type: String, default: "" },
    appliedDate: { type: Date, default: Date.now },
    status: { type: String, enum: STATUS_ENUM, default: "Wishlist" },
    salaryExpected: { type: String, default: "" },
    notes: { type: String, default: "" },
    followUpDate: { type: Date, default: null },
    followUpDone: { type: Boolean, default: false },
    source: { type: String, enum: SOURCE_ENUM, default: "Other" },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
module.exports.STATUS_ENUM = STATUS_ENUM;
