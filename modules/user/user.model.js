const mongoose = require("mongoose");
const constants = require("../../constants");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      maxlength: [100, "Full Name should not exceed 100 characters!"],
      required: [true, "Full Name is required!"],
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
      required: [true, "User picture is required!"],
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
