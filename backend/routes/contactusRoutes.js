const express = require("express");

const router = express.Router();

const {
  createContactMessage,
  getAllMessages,
  deleteMessage,
} = require("../controllers/contactUsController");

/**
 * @swagger
 * /api/create:
 *   post:
 *     summary: Create a contact message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - message
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact message sent successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
// ✅ Create Message
router.post("/create", createContactMessage);

/**
 * @swagger
 * /api/all:
 *   get:
 *     summary: Get all contact messages
 *     tags: [Contact]
 *     responses:
 *       200:
 *         description: List of contact messages
 *       500:
 *         description: Server error
 */
// ✅ Get All Messages
router.get("/all", getAllMessages);

/**
 * @swagger
 * /api/delete/{id}:
 *   delete:
 *     summary: Delete a contact message by id
 *     tags: [Contact]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *       404:
 *         description: Message not found
 *       500:
 *         description: Server error
 */
// ✅ Delete Message
router.delete("/delete/:id", deleteMessage);

module.exports = router;
