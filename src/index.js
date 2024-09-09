import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import todoHandler from "./routeHandler/todoHandler.js";
import userHandler from "./routeHandler/userHandler.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/todos");
//   .then(() => console.log("DB connected"))
//   .catch((err) => console.log(err));

mongoose.connection.on("connected", () => {
  console.log("Connected");
});

mongoose.connection.on("disconnected", () => {
  console.log("DisConnected");
});

mongoose.connection.on("error", (err) => {
  console.log("Error...........................................", err);
});

app.use("/todo", todoHandler);
app.use("/user", userHandler);

const errorHandler = (err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
};

app.use(errorHandler);

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
