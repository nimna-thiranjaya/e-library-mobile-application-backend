const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    blogTitle: {
      type: String,
      required: [true, "Title is required!"],
      maxlength: [100, "Title must be less than 100 characters!"],
    },
    blogImage: {
      type: String,
      required: [true, "Image is required!"],
    },
    blogContent: {
      type: String,
      required: [true, "Content is required!"],
    },
    blogAuthor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required!"],
    },

    blogReference: {
      type: String,
    },
    blogCategory: {
      type: String,
      required: [true, "Category is required!"],
    },
    similarBooks: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
        },
      ],
    },
    videoLink: {
      type: String,
    },
    publishedOn: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", blogSchema);
