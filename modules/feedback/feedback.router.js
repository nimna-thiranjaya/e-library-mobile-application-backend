const express = require("express");
const feedbackController = require("./feedback.controller");
const authMiddleware = require("../auth/auth.middleware");
const constants = require("../../constants");

const FeedbackRouter = express.Router();

FeedbackRouter.post(
  "/createFeedback/:id",
  authMiddleware.authorize([constants.USER.ROLES.USER]),
  feedbackController.CreateFeedback
);

FeedbackRouter.get("/getFeedbacks/:id", feedbackController.GetFeedbacks);

FeedbackRouter.delete(
  "/deleteFeedback/:id",
  authMiddleware.authorize([constants.USER.ROLES.USER]),
  feedbackController.DeleteFeedback
);

FeedbackRouter.patch(
  "/updateFeedback/:id",
  authMiddleware.authorize([constants.USER.ROLES.USER]),
  feedbackController.UpdateFeedback
);
module.exports = FeedbackRouter;
