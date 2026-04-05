const fs = require("fs");
const path = require("path");

const templatePath = path.join(__dirname, "resume", "default.html");

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const buildLine = (values) => {
  const line = values.filter(Boolean).map(escapeHtml).join(" | ");
  return line || "N/A";
};

const renderListOrFallback = (items, renderItem) => {
  if (!Array.isArray(items) || items.length === 0) {
    return '<p class="empty">No details added</p>';
  }

  return items.map(renderItem).join("");
};

const renderChipList = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return '<p class="empty">No details added</p>';
  }

  return `
    <div class="chip-list">
      ${items.map((item) => `<span class="chip">${escapeHtml(item)}</span>`).join("")}
    </div>
  `;
};

const getProfileImageSrc = (profileImage) => {
  if (!profileImage) {
    return "";
  }

  const trimmedValue = String(profileImage).trim();

  if (trimmedValue.startsWith("data:image/")) {
    return trimmedValue;
  }

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue;
  }

  const isBase64Only = /^[A-Za-z0-9+/=\r\n]+$/.test(trimmedValue);

  if (isBase64Only) {
    const normalizedBase64 = trimmedValue.replace(/\s+/g, "");
    return `data:image/jpeg;base64,${normalizedBase64}`;
  }

  return "";
};

const renderProfileImage = (profileImage) => {
  const imageSrc = getProfileImageSrc(profileImage);

  if (!imageSrc) {
    return "";
  }

  return `
    <div class="profile-image-wrap">
      <img class="profile-image" src="${imageSrc}" alt="Profile" />
    </div>
  `;
};

const getResumeHTML = (resume) => {
  const template = fs.readFileSync(templatePath, "utf8");

  const replacements = {
    "{{FULL_NAME}}": escapeHtml(resume.fullName || "Unnamed Candidate"),
    "{{PROFILE_IMAGE}}": renderProfileImage(resume.profileImage),
    "{{CONTACT_LINE_1}}": buildLine([resume.email, resume.phone]),
    "{{CONTACT_LINE_2}}": buildLine([
      resume.address,
      resume.linkedin,
      resume.github,
    ]),
    "{{SUMMARY}}": escapeHtml(resume.summary || "No summary added"),
    "{{EDUCATION_ITEMS}}": renderListOrFallback(resume.education, (edu) => `
      <div class="item">
        <div class="item-title">${escapeHtml(edu.degree || "Degree")}</div>
        <div class="item-subtitle">
          ${escapeHtml(edu.institution || "Institution")}
        </div>
        <div class="muted">
          ${escapeHtml(edu.startYear || "")}${edu.startYear || edu.endYear ? " - " : ""}${escapeHtml(edu.endYear || "Present")}
        </div>
        <div class="description">${escapeHtml(edu.description || "")}</div>
      </div>
    `),
    "{{EXPERIENCE_ITEMS}}": renderListOrFallback(resume.experience, (exp) => `
      <div class="item">
        <div class="item-title">${escapeHtml(exp.role || "Role")}</div>
        <div class="item-subtitle">${escapeHtml(exp.company || "Company")}</div>
        <div class="muted">
          ${escapeHtml(exp.startDate || "")}${exp.startDate || exp.endDate ? " - " : ""}${escapeHtml(exp.endDate || "Present")}
        </div>
        <div class="description">${escapeHtml(exp.description || "")}</div>
      </div>
    `),
    "{{SKILLS_ITEMS}}": renderChipList(resume.skills),
    "{{PROJECT_ITEMS}}": renderListOrFallback(resume.projects, (project) => `
      <div class="item">
        <div class="item-title">${escapeHtml(project.title || "Project")}</div>
        <div class="description">${escapeHtml(project.description || "")}</div>
        <div class="muted">${escapeHtml(project.link || "")}</div>
      </div>
    `),
    "{{CERTIFICATION_ITEMS}}": renderListOrFallback(
      resume.certifications,
      (certification) => `
        <div class="item">
          <div class="item-title">${escapeHtml(certification.title || "Certification")}</div>
          <div class="item-subtitle">${escapeHtml(certification.issuer || "")}</div>
          <div class="muted">${escapeHtml(certification.year || "")}</div>
        </div>
      `,
    ),
    "{{LANGUAGE_ITEMS}}": renderChipList(resume.languages),
  };

  return Object.entries(replacements).reduce(
    (html, [placeholder, value]) => html.replaceAll(placeholder, value),
    template,
  );
};

module.exports = getResumeHTML;
