const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const contactUsRoutes = require("./routes/contactusRoutes");

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

// PORT
const PORT = process.env.PORT || 5000;

// Base URL
const liveBaseUrl =
  process.env.PUBLIC_BASE_URL || "https://resumebackend-1-v08r.onrender.com";

// Swagger Definition
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Resume Maker API",
    version: "1.0.0",
    description: "API for creating and managing resumes",
  },

  servers: [
    {
      url: liveBaseUrl,
      description: "Production Server",
    },

    {
      url: `http://localhost:${PORT}`,
      description: "Development Server",
    },
  ],
};

// Swagger Options
const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, "./routes/*.js")],
};

const specs = swaggerJsdoc(options);

// Middleware
app.use(express.json());
app.use(cors());

// Swagger Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// API Routes
app.use("/api", userRoutes);
app.use("/api", resumeRoutes);
app.use("/api", contactUsRoutes);

// Database Connect + Server Start
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed ❌");
    console.log(err.message);
  });
