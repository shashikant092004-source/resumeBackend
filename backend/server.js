const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const resumeRouts = require("./routes/resumeRoutes");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

const port = process.env.PORT || 5000;
const liveBaseUrl =
  process.env.PUBLIC_BASE_URL || "https://resumebackend-1-v08r.onrender.com";

// Swagger definition
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
      description: "Production server",
    },
    {
      url: `http://localhost:${port}`,
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

// Middleware
app.use(express.json());
app.use(cors());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api", userRoutes);
app.use("/api", resumeRouts);

// Start Server after DB connect
const PORT = port;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
  });
});
