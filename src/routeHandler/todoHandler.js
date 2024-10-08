import express from "express";
import mongoose from "mongoose";
import todoSchema from "../schemas/todoSchema.js";
import userSchema from "../schemas/userSchema.js";
import checkLogin from "../middlewares/checkLogin.js";

const router = express.Router();
const Todo = mongoose.model("Todo", todoSchema);
const User = mongoose.model("User", userSchema);

// GET ALL
router.get("/", checkLogin, async (req, res) => {
  try {
    const todoList = await Todo.find()
      .populate("user", "name userName -_id")
      .select({
        _id: 0,
        createdAt: 0,
        updatedAt: 0,
      })
      .limit(20)
      .skip(0);
    res.status(200).json({
      message: "Todo fetches successfully",
      data: todoList,
    });
  } catch (err) {
    res.status(500).json({
      error: "There is a server side error",
    });
  }
});

// GET A
router.get("/:id", async (req, res) => {
  try {
    const todo = await Todo.find({ _id: req.params.id })
      .select({
        _id: 0,
        createdAt: 0,
        updatedAt: 0,
      })
      .limit(20)
      .skip(0);
    res.status(200).json({
      message: "Todo fetches successfully",
      data: todo,
    });
  } catch (err) {
    res.status(500).json({
      error: "There is a server side error",
    });
  }
});

// POST A
router.post("/", checkLogin, async (req, res) => {
  try {
    const newTodo = new Todo({
      ...req.body,
      user: req.userId,
    });
    const todo = await newTodo.save();
    await User.updateOne(
      {
        _id: req.userId,
      },
      {
        $push: {
          todos: todo._id,
        },
      }
    );
    res.status(200).json({
      message: "Todo inserted successfully",
      data: todo,
    });
  } catch (err) {
    res.status(500).json({
      error: "There is a server side error",
    });
  }
});

// POST MANY
router.post("/many", async (req, res) => {
  try {
    const todoList = await Todo.insertMany(req.body);
    res.status(200).json({
      message: "Todo are inserted successfully",
      data: todoList,
    });
  } catch (err) {
    res.status(500).json({
      error: "There is a server side error",
    });
  }
});

// PUT
router.put("/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          status: "inactive",
        },
      },
      { new: true }
    );
    res.status(200).json({
      message: "Todo updated successfully",
      data: updatedTodo,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id }).select({
      _id: 0,
      createdAt: 0,
      updatedAt: 0,
    });
    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }
    res.status(200).json({
      message: "Todo deleted successfully",
      data: todo,
    });
  } catch (err) {
    res.status(500).json({
      error: "There is a server side error",
    });
  }
});

export default router;
