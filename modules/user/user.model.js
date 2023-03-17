const mongoose = require("mongoose");
const constants = require("../../constants");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      maxlength: [50, "First name should not exceed 50 characters!"],
      required: [true, "First name is required!"],
    },

    lastName: {
      type: String,
      maxlength: [50, "Last name should not exceed 50 characters!"],
      required: [true, "Last name is required!"],
    },

    email: {
      type: String,
      unique: true,
      maxlength: [50, "email should not exceed 50 characters!"],
      required: [true, "Email is required!"],
      validate: {
        validator: (value) => {
          return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            value
          );
        },
        message: "Invalid email address!",
      },
    },

    picture: {
      type: String,
    },

    role: {
      type: String,
      required: [true, "User role is required!"],
      enum: {
        values: [constants.USER.ROLES.ADMIN, constants.USER.ROLES.USER],
        message: "Valid role is required!",
      },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
