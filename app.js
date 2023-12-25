const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const studentRouter = require("./routes/student");
const courseRouter = require("./routes/course");
const teacherRouter = require("./routes/teacher");

const app = express();
app.use(cors()); // Enable CORS for all routes
const PORT = 3000;
const uri =
  "mongodb+srv://muahmad710:1SvVw4WaY2pTq9aG@cluster0.mnzlvoq.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.warn("An error occurred", err);
  });

app.listen(PORT, async (error) => {
  if (!error) console.log("Server is Successfully Running on " + PORT);
  else console.warn("Error occurred, server can't start", error);
});

app.use(express.json());
// Define the usage of all routers here
app.use("/api/student", studentRouter);
app.use("/api/course", courseRouter);
app.use("/api/teacher", teacherRouter);

