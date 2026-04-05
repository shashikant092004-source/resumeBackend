const express = require("express");
const router = express.Router();

const {
  createResume,
  getResumes,
  updateResume,
  deleteResume,
  downloadResume,
} = require("../controllers/resumeController");

// ✅ Route
router.post("/resume", createResume);
router.get("/resume/:userId", getResumes);
router.put("/resume_update/:id", updateResume);
router.delete("/resume_del/:id", deleteResume);
router.get("/resume/download/:id",downloadResume)
module.exports = router;
