const Resume = require("../models/Resume");
const mongoose = require("mongoose");
const puppeteer = require("puppeteer");
const fs = require("fs");
const getResumeHTML = require("../templates/resumeTemplate");

const browserCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];

const getBrowserPath = () => {
  if (
    process.env.PUPPETEER_EXECUTABLE_PATH &&
    fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)
  ) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  const localBrowserPath = browserCandidates.find((browserPath) =>
    fs.existsSync(browserPath),
  );

  if (localBrowserPath) {
    return localBrowserPath;
  }

  try {
    return puppeteer.executablePath();
  } catch {
    return "";
  }
};

// ✅ Create Resume Controller
exports.createResume = async (req, res) => {
  try {
    const {
      user,
      fullName,
      email,
      phone,
      address,
      linkedin,
      github,
      profileImage,
      summary,
      education,
      experience,
      skills,
      projects,
      certifications,
      languages,
    } = req.body;

    // ✅ validation
    if (!user || !fullName) {
      return res.status(400).json({
        message: "User and Full Name are required",
      });
    }

    // ✅ create resume
    const resume = await Resume.create({
      user,
      fullName,
      email,
      phone,
      address,
      linkedin,
      github,
      profileImage,
      summary,
      education,
      experience,
      skills,
      projects,
      certifications,
      languages,
    });

    res.status(201).json({
      message: "Resume created successfully ✅",
      data: resume,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getResumes = async (req, res) => {
  try {
    const { userId } = req.params;

    // ❌ agar userId nahi mila to error
    if (!userId) {
      return res.status(400).json({
        message: "userId is required ❌",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid userId. Please provide a valid MongoDB ObjectId.",
      });
    }

    // ✅ sirf us user ka data
    const resumes = await Resume.find({ user: userId }).populate(
      "user",
      "name email",
    );

    res.json({
      total: resumes.length,
      data: resumes,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateResume = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ check id
    if (!id) {
      return res.status(400).json({
        message: "Resume ID is required ❌",
      });
    }

    // ✅ update resume
    const updatedResume = await Resume.findByIdAndUpdate(id, req.body, {
      new: true, // updated data return karega
      runValidators: true, // schema validation follow karega
    });

    // ❌ not found
    if (!updatedResume) {
      return res.status(404).json({
        message: "Resume not found ❌",
      });
    }

    res.json({
      message: "Resume updated successfully ✅",
      data: updatedResume,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ check id valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Resume ID ❌",
      });
    }

    // ✅ delete
    const deletedResume = await Resume.findByIdAndDelete(id);

    // ❌ not found
    if (!deletedResume) {
      return res.status(404).json({
        message: "Resume not found ❌",
      });
    }

    res.json({
      message: "Resume deleted successfully ✅",
      data: deletedResume,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.downloadResume = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Resume ID is required ❌",
      });
    }

    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found ❌",
      });
    }

    // ✅ Generate HTML from separate template file
    const html = getResumeHTML(resume);

    // ✅ Convert template HTML to PDF
    const executablePath = getBrowserPath();

    if (!executablePath) {
      return res.status(500).json({
        message:
          "No browser executable found for PDF generation. Set PUPPETEER_EXECUTABLE_PATH or install Puppeteer's bundled browser.",
      });
    }

    const browser = await puppeteer.launch({
      headless: true,
      executablePath,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "load" });

    // ✅ Convert HTML → PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    // ✅ Send response
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${resume.fullName}_resume.pdf`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
