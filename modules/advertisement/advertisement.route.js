const express = require("express");
const advertisementController = require("./advertisement.controller");
const commonMiddleware = require("../common/common.middleware");
const authMiddleware = require("../auth/auth.middleware");
const constants = require("../../constants");

const AdvertisementRouter = express.Router();

AdvertisementRouter.post(
  "/createAdvertisement",
  commonMiddleware.multerUploader.single("file"),
  advertisementController.CreateAdvertisement
);

AdvertisementRouter.get("/getAllAdvertisements", advertisementController.GetAllAdvertisements);

AdvertisementRouter.delete(
  "/deleteAdvertisement/:id",
  advertisementController.DeleteAdvertisement
);

AdvertisementRouter.get("/getAdvertisement/:id", advertisementController.GetAdvertisement);

//set multer to upload image and pdf file
AdvertisementRouter.patch(
  "/updateAdvertisement/:id",
  commonMiddleware.multerUploader.single("file"),
  advertisementController.UpdateAdvertisement
);

module.exports = AdvertisementRouter;
