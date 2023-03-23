const mongoose = require("mongoose");

const AdvertisementSchema = new mongoose.Schema(
  {
    adTitle: {
      type: String,
      required: [true, "Advertisement title is required!"],
      maxlength: [500, "Advertisement title should not exceed 500 characters!"],
    },

    advertisementBanner: {
      type: String,
      //required: [true, "Advertisement image is required!"],
    },

    adDescription: {
      type: String,
      required: [true, "Advertisement description is required!"],
      maxlength: [800, "Advertisement description should not exceed 800 characters!"],
    },

    adVideoUrl: {
      type: String,
      required: [true, "Advertisement video url is required!"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("Advertisement", AdvertisementSchema);
