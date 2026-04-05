const express = require("express");
const router = express.Router();

const {
  createResume,
  getResumes,
  updateResume,
  deleteResume,
  downloadResume,
} = require("../controllers/resumeController");

/**
 * @swagger
 * /api/resume:
 *   post:
 *     summary: Create a new resume
 *     tags: [Resumes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               title:
 *                 type: string
 *               content:
 *                 type: object
 *     responses:
 *       201:
 *         description: Resume created successfully
 *       400:
 *         description: Bad request
 */
router.post("/resume", createResume);

/**
 * @swagger
 * /api/resume/{userId}:
 *   get:
 *     summary: Get resumes for a user
 *     tags: [Resumes]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of resumes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   title:
 *                     type: string
 *                   content:
 *                     type: object
 */
router.get("/resume/:userId", getResumes);

/**
 * @swagger
 * /api/resume_update/{id}:
 *   put:
 *     summary: Update a resume
 *     tags: [Resumes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: object
 *     responses:
 *       200:
 *         description: Resume updated successfully
 *       404:
 *         description: Resume not found
 */
router.put("/resume_update/:id", updateResume);

/**
 * @swagger
 * /api/resume_del/{id}:
 *   delete:
 *     summary: Delete a resume
 *     tags: [Resumes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resume deleted successfully
 *       404:
 *         description: Resume not found
 */
router.delete("/resume_del/:id", deleteResume);

/**
 * @swagger
 * /api/resume/download/{id}:
 *   get:
 *     summary: Download a resume
 *     tags: [Resumes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resume downloaded
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Resume not found
 */
router.get("/resume/download/:id", downloadResume);
module.exports = router;
