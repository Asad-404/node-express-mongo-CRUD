import express from "express";
import mongoose from "mongoose";
import todoHandler from "./routeHandler/todoHandler.js";

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

function errorHandler(err, req, res, next) {
  if (res.headerSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
}

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
