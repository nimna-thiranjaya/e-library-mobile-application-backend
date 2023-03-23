const { StatusCodes } = require("http-status-codes");
const { startSession } = require("mongoose");
const commonUtils = require("../common/common.util");
const commonService = require("../common/common.service");
const Advertisement = require("./advertisement.model");
const Auth = require("../auth/auth.model");
const AdvertisementService = require("./advertisement.service");
const AuthService = require("../auth/auth.service");

// Error messages
const BadRequestError = require("../error/error.classes/BadRequestError");
const NotFoundError = require("../error/error.classes/NotFoundError");

//create advertisement
const CreateAdvertisement = async (req, res) => {
  const advertisement = new Advertisement(req.body);

  //get all files and validate as a image file and pdf file
  if (!req.file) {
    throw new BadRequestError("Please upload a banner image");
  }

  if (req.file.mimetype !== "image/jpeg" && req.file.mimetype !== "image/png") {
    throw new BadRequestError("Please upload a valid image file");
  }

  let createdAdvertisement = null;

  //start mongoose default session to handle transactions
  const session = await startSession();
  try {
    //start transaction
    session.startTransaction();

    //construct image name
    const imageName = `AdvertisementBanner_${advertisement._id}_${Date.now()}`;
    const banner = commonUtils.generateFirebaseStorageURL(imageName);

    //set advertisement banner
    advertisement.advertisementBanner = banner;

    //save advertisement
    createdAdvertisement = await AdvertisementService.save(
      advertisement,
      session
    );

    //upload image to firebase storage
    await commonService.uploadToFirebase(req.file, banner);

    //commit transaction
    await session.commitTransaction();

    //send response
    res.status(StatusCodes.CREATED).json({
      message: "Advertisement created successfully",
      advertisement: createdAdvertisement,
    });
  } catch (err) {
    //abort transaction
    await session.abortTransaction();
    throw err;
  } finally {
    //end session
    session.endSession();
  }
};

//get all advertisements
const GetAllAdvertisements = async (req, res) => {
  //get all advertisements
  const advertisements = await AdvertisementService.findAll();

  //send response
  res.status(StatusCodes.OK).json({
    message: "Advertisements fetched successfully",
    advertisements,
  });
};

//delete advertisement
const DeleteAdvertisement = async (req, res) => {
  const id = req.params.id;

  //get and validate advertisement
  const advertisement = await AdvertisementService.findById(id);

  if (!advertisement) {
    throw new NotFoundError("Advertisement not found");
  }

  //delete advertisement
  await AdvertisementService.findByIdAndDelete(id);

  //send response
  res.status(StatusCodes.OK).json({
    message: "Advertisement deleted successfully",
  });
};

const GetAdvertisement = async (req, res) => {
  const id = req.params.id;

  //get and validate advertisement
  const advertisement = await AdvertisementService.findById(id);

  if (!advertisement) {
    throw new NotFoundError("Advertisement not found");
  }

  //send response
  res.status(StatusCodes.OK).json({
    advertisement,
  });
};

//update advertisement
const UpdateAdvertisement = async (req, res) => {
  const id = req.params.id;

  //get and validate advertisement
  const advertisement = await AdvertisementService.findById(id);

  if (!advertisement) {
    throw new NotFoundError("Advertisement not found");
  }

  //get all files and validate as a image file and pdf file
  var file = req.files;

  //start mongoose default session to handle transactions

  const session = await startSession();
  try {
    //start transaction
    session.startTransaction();

    //update advertisement
    advertisement.set(req.body);

    if (file) {
      if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
        throw new BadRequestError("Please upload a valid image file");
      }

      //construct image name
      const imageName = `AdvertisementBanner_${
        advertisement._id
      }_${Date.now()}`;
      const banner = commonUtils.generateFirebaseStorageURL(imageName);

      //set advertisement banner
      advertisement.advertisementBanner = banner;

      //upload image to firebase storage
      await commonService.uploadToFirebase(file, banner);
    }

    //save advertisement
    await AdvertisementService.save(advertisement, session);

    //commit transaction
    await session.commitTransaction();

    //send response
    res.status(StatusCodes.OK).json({
      message: "Advertisement updated successfully",
      advertisement,
    });
  } catch (err) {
    //abort transaction
    await session.abortTransaction();
    throw err;
  } finally {
    //end session
    session.endSession();
  }
};
module.exports = {
  CreateAdvertisement,
  GetAllAdvertisements,
  DeleteAdvertisement,
  GetAdvertisement,
  UpdateAdvertisement,
};
