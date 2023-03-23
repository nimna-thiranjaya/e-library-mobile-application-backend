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
      required: [true, "Book Author is required!"],
      maxlength: [70, "Book Author should not exceed 70 characters!"],
    },

    bookBanner: {
      type: String,
      required: [true, "Book banner is required!"],
    },

    bookCategories: {
      type: [String],
      required: [true, "Book categories are required!"],
      validate: {
        validator: (value) => {
          return value.length > 0;
        },
        message: "Book category is required!",
      },
    },

    bookDescription: {
      type: String,
      required: [true, "Book description is required!"],
      maxlength: [1000, "Book description should not exceed 1000 characters!"],
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
