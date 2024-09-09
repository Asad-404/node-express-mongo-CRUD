import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import userSchema from "../schemas/userSchema.js";
const router = express.Router();

const User = mongoose.model("User", userSchema);

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      userName: req.body.userName,
      password: hashedPass,
    });
    const user = await newUser.save();
    res.status(200).json({
      message: "User signup successfully",
      data: user,
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      error: "There is a server side error",
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.find({ userName: req.body.userName });
    if (user && user.length > 0) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      );
      if (isValidPassword) {
        // generate token
        const token = jwt.sign(
          {
            userName: user[0].userName,
            userId: user[0]._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        res.status(200).json({
          token,
          message: "Login Successful",
        });
      } else {
        res.status(401).json({
          message: "Authentication failed!!",
        });
      }
    } else {
      res.status(401).json({
        message: "Authentication failed!!",
      });
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      error: "There is a server side error",
    });
  }
});

// GET ALL USERS
router.get("/all", async (req, res) => {
  try {
    const users = await User.find().populate("todos", "title -_id");
    res.status(200).json({
      data: users,
      message: "Successful",
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      error: "There is a server side error",
    });
  }
});

export default router;
