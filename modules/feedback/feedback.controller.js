const { StatusCodes } = require("http-status-codes");
const Feedback = require("./feedback.model");
const bookService = require("../book/book.service");
const FeedbackService = require("./feedback.service");

// Error messages
const BadRequestError = require("../error/error.classes/BadRequestError");
const NotFoundError = require("../error/error.classes/NotFoundError");

const CreateFeedback = async (req, res) => {
  const feedback = new Feedback(req.body);
  const bookId = req.params.id;
  const auth = req.auth;

  try {
    //construct feedback object
    feedback.user = auth.id;
    feedback.book = bookId;

    //save feedback
    const createdFeedback = await FeedbackService.Save(feedback);

    //send response
    res.status(StatusCodes.CREATED).json({
      message: "Feedback created successfully",
      feedback: createdFeedback,
    });
  } catch (err) {
    throw err;
  }
};

//get feedbacks for a book
const GetFeedbacks = async (req, res) => {
  const bookId = req.params.id;

  const isBookExists = await bookService.findById(bookId);

  if (!isBookExists) {
    throw new NotFoundError("Book not found");
  }

  //get feedbacks
  const feedbacks = await FeedbackService.findAll({ book: bookId });

  //send response
  res.status(StatusCodes.OK).json({
    feedbacks,
  });
};

//delete feedback
const DeleteFeedback = async (req, res) => {
  const feedbackId = req.params.id;
  const auth = req.auth;

  //get and validate feedback
  const feedbackExists = await FeedbackService.findById(feedbackId);

  if (!feedbackExists) {
    throw new NotFoundError("Feedback not found");
  }

  //check if feedback belongs to user
  if (feedbackExists.user.toString() !== auth.id) {
    throw new BadRequestError("Feedback does not belong to user");
  }

  //delete feedback
  await FeedbackService.findByIdAndDelete(feedbackId);

  //send response
  res.status(StatusCodes.OK).json({
    message: "Feedback deleted successfully",
  });
};

//update feedback
const UpdateFeedback = async (req, res) => {
  const feedbackId = req.params.id;
  const auth = req.auth;

  //get and validate feedback
  const feedbackExists = await FeedbackService.findById(feedbackId);

  if (!feedbackExists) {
    throw new NotFoundError("Feedback not found");
  }

  //check if feedback belongs to user
  if (feedbackExists.user.toString() !== auth.id) {
    throw new BadRequestError("Feedback does not belong to user");
  }

  try {
    //construct update body
    feedbackExists.set(req.body);

    //update feedback
    const updatedFeedback = await FeedbackService.Save(feedbackExists);

    //send response
    res.status(StatusCodes.OK).json({
      message: "Feedback updated successfully",
      feedback: updatedFeedback,
    });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  CreateFeedback,
  GetFeedbacks,
  DeleteFeedback,
  UpdateFeedback,
};
