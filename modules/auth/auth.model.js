const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
      ref: "User",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("Auth", AuthSchema);
