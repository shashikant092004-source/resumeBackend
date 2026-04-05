const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 👤 Personal Info
    fullName: {
      type: String,
      required: true,
    },
    email: String,
    phone: String,
    address: String,
    linkedin: String,
    github: String,

    // 🖼️ Profile Image (URL or file path)
    profileImage: {
      type: String,
    },

    // 🎯 Summary
    summary: {
      type: String,
    },

    // 🎓 Education
    education: [
      {
        degree: String,
        institution: String,
        startYear: String,
        endYear: String,
        description: String,
      },
    ],

    // 💼 Experience
    experience: [
      {
        company: String,
        role: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],

    // 🛠️ Skills
    skills: [String],

    // 🚀 Projects
    projects: [
      {
        title: String,
        description: String,
        link: String,
      },
    ],

    // 🏆 Certifications
    certifications: [
      {
        title: String,
        issuer: String,
        year: String,
      },
    ],

    // 🌐 Languages
    languages: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);