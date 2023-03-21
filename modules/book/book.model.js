const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    bookName: {
      type: String,
      required: [true, "Book name is required!"],
      maxlength: [70, "Book name should not exceed 70 characters!"],
    },

    bookAuthor: {
      type: String,
      required: [true, "Book auther is required!"],
      maxlength: [70, "Book auther should not exceed 70 characters!"],
    },

    bookBanner: {
      type: String,
      required: [true, "Book banner is required!"],
    },

    bookDescription: {
      type: String,
      required: [true, "Book description is required!"],
      maxlength: [800, "Book description should not exceed 800 characters!"],
    },

    eBook: {
      type: String,
      required: [true, "Ebook is required!"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("Book", BookSchema);
