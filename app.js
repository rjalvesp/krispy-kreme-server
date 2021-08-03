const createError = require("http-errors");
const express = require("express");
const logger = require("morgan");
const helmet = require("helmet");

const routes = require("./routes/v1");
const handleApiError = require("./_helpers/errors/error-api-handler");

const app = express();

const cors = require("cors");

const checkOrigin = (origin, callback) => callback(null, { origin: true });

app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(handleApiError);
app.get("/", (req, res) => res.status(200).json({ alive: true }));
app.use("/api/v1", cors(checkOrigin), routes);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Handle errors manually
app.use(function (err, req, res) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
