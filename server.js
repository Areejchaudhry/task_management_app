
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const taskRoutes = require("./routes/tasks");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TaskFlow API is running",
  });
});

app.use("/api/tasks", taskRoutes);

// Handle unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Handle invalid JSON
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body",
    });
  }

  next(error);
});

// Central error handler
app.use((error, req, res, next) => {
  console.error(error);

  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");

    app.listen(PORT, () => {
      console.log(`TaskFlow running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
