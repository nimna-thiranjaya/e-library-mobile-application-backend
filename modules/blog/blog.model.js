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
      type: String,
      required: [true, "Author is required!"],
    },
    blogAuthorImage: {
      type: String,
      required: [true, "Author image is required!"],
    },
    references: {
      type: String,
    },
    blogCategory: {
      type: String,
      required: [true, "Category is required!"],
    },
    similarBooks: {
      type: Array,
    },
    videoLink: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", blogSchema);
