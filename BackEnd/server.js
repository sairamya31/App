const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jobRoutes = require("./routes/jobs");
const skillRoutes = require("./routes/skills");
const usersRoutes = require("./routes/user");
const HttpError = require("./models/http-error");
const jobscore = require("./routes/jobScore")
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
}); //cors error

app.use("/users", usersRoutes);
app.use("/jobs", jobRoutes);
app.use("/skills", skillRoutes);
app.use("/jobScore", jobscore);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

const dbUrl ="mongodb+srv://SANJU:sanju_123456@cluster0.f8yjf.mongodb.net/SIHProject?retryWrites=true&w=majority";

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5002);
  })
  .catch((err) => {
    console.log(err);
  });
