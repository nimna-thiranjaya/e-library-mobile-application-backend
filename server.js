const express = require("express");
const cors = require("cors");
require("express-async-errors");

const commonConfig = require("./modules/common/common.config");
const errorHandlerMiddleware = require("./modules/error/error.middleware");
const NotFoundError = require("./modules/error/error.classes/NotFoundError");

const constants = require("./constants");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

//import routes
const AuthRouter = require("./modules/auth/auth.route");
const UserRouter = require("./modules/user/user.route");
const BookRouter = require("./modules/book/book.route");
const FeedbackRouter = require("./modules/feedback/feedback.router");
const AdvertisementRouter = require("./modules/advertisement/advertisement.route");

//define routes
app.use(constants.API.PREFIX.concat("/auth"), AuthRouter);
app.use(constants.API.PREFIX.concat("/user"), UserRouter);
app.use(constants.API.PREFIX.concat("/book"), BookRouter);
app.use(constants.API.PREFIX.concat("/feedback"), FeedbackRouter);
app.use(constants.API.PREFIX.concat("/advertisement"), AdvertisementRouter);

//error handler middleware
app.use(errorHandlerMiddleware);

//404 not found route
app.use((req, res, next) => {
  throw new NotFoundError("API endpoint not found!");
});

const start = async () => {
  const port = process.env.PORT || 5001;
  try {
    await commonConfig.DatabaseConnection();
    app.listen(port, () => {
      console.log(`SERVER IS LISTENING ON PORT ${port}...`);
    });
  } catch (err) {
    console.error(err);
  }
};

start();
