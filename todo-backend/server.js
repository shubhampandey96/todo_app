// server.js

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");

const connectDB = require("./db");
const todoRoutes = require("./routes/todoRoutes");
const { register, httpRequestDurationSeconds } = require("./utils/metrics");
const context = require("./utils/context");
const logger = require("./utils/logger");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Request context + logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const requestId = uuidv4();

  // Create a separate context store for each request
  const store = new Map();

  // Run request inside the async context
  context.run(store, () => {
    context.set("requestId", requestId);
    res.set("X-Request-ID", requestId);

    // Log the incoming request
    logger.info(`Incoming ${req.method} request to ${req.path}`, {
      method: req.method,
      path: req.path,
      query: req.query,
      requestId,
    });

    // When request finishes, measure metrics + log
    res.on("finish", () => {
      const duration = (Date.now() - start) / 1000;

      httpRequestDurationSeconds
        .labels(req.method, req.path, res.statusCode)
        .observe(duration);

      logger.info(`Request completed`, {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
        requestId,
      });
    });

    next();
  });
});

// Routes
app.use("/api", todoRoutes);

// MongoDB connection
connectDB();

// Prometheus metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  logger.info(`Server is running on the port ${PORT}`);
});

module.exports = app;
