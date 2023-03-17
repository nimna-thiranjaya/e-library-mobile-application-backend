const { StatusCodes } = require("http-status-codes");
const { startSession } = require("mongoose");
const userUtil = require("./user.util");
const commonUtils = require("../common/common.util");
const commonService = require("../common/common.service");
const User = require("./user.model");
const Auth = require("../auth/auth.model");
const UserService = require("./user.service");
const AuthService = require("../auth/auth.service");

// Error messages
const BadRequestError = require("../error/error.classes/BadRequestError");
const NotFoundError = require("../error/error.classes/NotFoundError");

const CreateUser = async (req, res) => {
  const { password } = req.body;
  const user = new User(req.body);

  //validate Password
  if (!password) {
    throw new BadRequestError("Password is required");
  }

  //validate image
  if (!req.file) {
    throw new BadRequestError("Please upload an image");
  }

  if (req.file.mimetype.split("/")[0] !== "image") {
    throw new BadRequestError("Only images are permitted!");
  }

  //construct auth object
  const auth = new Auth();
  auth._id = user.email;
  auth.password = await userUtil.getEncryptedPassword(password);
  auth.user = user;

  let createdUser = null;
  let picture = null;

  //start mongoose default session to handle transactions
  const session = await startSession();

  try {
    //start transaction
    session.startTransaction();

    //construct image name
    const imageName = `ProfilePicture_${auth._id}_${Date.now()}`;
    picture = commonUtils.generateFirebaseStorageURL(imageName);

    //set user picture
    user.picture = picture;

    //save user and auth
    createdUser = await UserService.save(user, session);
    await AuthService.save(auth, session);

    //upload image to firebase storage
    await commonService.uploadToFirebase(req.file, imageName);

    //commit transaction
    await session.commitTransaction();

    return res.status(StatusCodes.CREATED).json({
      message: "User created successfully",
      user: createdUser,
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

//get user profile
const GetUserProfile = async (req, res) => {
  const auth = req.auth;

  //get user profile
  const user = await UserService.findById(auth.id);

  //check if user exists
  if (!user) {
    throw new NotFoundError("User not found");
  }

  return res.status(StatusCodes.OK).json({
    user,
  });
};

//delete user profile
const DeleteUserProfile = async (req, res) => {
  const auth = req.auth;

  //get user profile
  const user = await UserService.findById(auth.id);

  //check if user exists
  if (!user) {
    throw new NotFoundError("User not found");
  }

  //start mongoose default session to handle transactions
  const session = await startSession();

  try {
    //start transaction
    session.startTransaction();

    //delete user profile
    await UserService.findByIdAndDelete(auth.id, session);

    //delete auth
    await AuthService.findByIdAndDelete(auth.email, session);

    //commit transaction
    await session.commitTransaction();
  } catch (err) {
    //abort transaction
    await session.abortTransaction();
    throw err;
  } finally {
    //end session
    session.endSession();
  }

  return res.status(StatusCodes.OK).json({
    message: "User deleted successfully",
  });
};

module.exports = { CreateUser, GetUserProfile, DeleteUserProfile };
