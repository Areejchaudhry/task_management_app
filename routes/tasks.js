
const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");

const router = express.Router();

const allowedFields = [
  "title",
  "description",
  "priority",
  "status",
  "dueDate",
];

function validateTaskInput(body, isUpdate = false) {
  const errors = [];

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return ["Request body must be a JSON object"];
  }

  const keys = Object.keys(body);

  if (keys.some((key) => !allowedFields.includes(key))) {
    errors.push("Request contains unsupported fields");
  }

  if (!isUpdate && !String(body.title || "").trim()) {
    errors.push("Task title is required");
  }

  if (
    body.title !== undefined &&
    (typeof body.title !== "string" ||
      body.title.trim().length < 2 ||
      body.title.trim().length > 100)
  ) {
    errors.push("Title must be between 2 and 100 characters");
  }

  if (
    body.description !== undefined &&
    (typeof body.description !== "string" ||
      body.description.length > 500)
  ) {
    errors.push("Description must be a string of at most 500 characters");
  }

  if (
    body.priority !== undefined &&
    !["Low", "Medium", "High"].includes(body.priority)
  ) {
    errors.push("Priority must be Low, Medium, or High");
  }

  if (
    body.status !== undefined &&
    !["Pending", "In Progress", "Completed"].includes(body.status)
  ) {
    errors.push("Status must be Pending, In Progress, or Completed");
  }

  if (
    body.dueDate !== undefined &&
    body.dueDate !== null &&
    (typeof body.dueDate !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(body.dueDate) ||
      Number.isNaN(Date.parse(`${body.dueDate}T00:00:00Z`)) ||
      new Date(`${body.dueDate}T00:00:00Z`).toISOString().slice(0, 10) !== body.dueDate)
  ) {
    errors.push("Due date must be a valid YYYY-MM-DD date or null");
  }

  return errors;
}

// GET all tasks, with optional status and priority filters
router.get("/", async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
});

// GET one task by ID
router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
});

// POST create a task
router.post("/", async (req, res, next) => {
  try {
    const errors = validateTaskInput(req.body);

    if (errors.length) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

// PUT update a task
router.put("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const errors = validateTaskInput(req.body, true);

    if (errors.length) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update",
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE a task
router.delete("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
