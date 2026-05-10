const express = require("express");

const router = express.Router();

const {
  createContactMessage,
  getAllMessages,
  deleteMessage,
} = require("../controllers/contactUsController");

// ✅ Create Message
router.post("/create", createContactMessage);

// ✅ Get All Messages
router.get("/all", getAllMessages);

// ✅ Delete Message
router.delete("/delete/:id", deleteMessage);

module.exports = router;
