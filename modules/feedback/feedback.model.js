const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    feedback: {
      type: String,
      required: [true, "Feedback is required!"],
      maxlength: [500, "Feedback must be less than 500 characters!"],
    },

    rating: {
      type: Number,
      required: [true, "Rating is required!"],
      min: [1, "Rating must be between 1 and 5!"],
      max: [5, "Rating must be between 1 and 5!"],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required!"],
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Book is required!"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
