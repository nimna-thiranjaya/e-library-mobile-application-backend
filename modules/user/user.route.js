const express = require("express");
const UserController = require("./user.controller");
const commonMiddleware = require("../common/common.middleware");
const authMiddleware = require("../auth/auth.middleware");

const constants = require("../../constants");

const UserRouter = express.Router();

UserRouter.post(
  "/register",
  commonMiddleware.multerUploader.single("picture"),
  UserController.CreateUser
);

UserRouter.get(
  "/profile",
  authMiddleware.authorize([
    constants.USER.ROLES.USER,
    constants.USER.ROLES.ADMIN,
  ]),
  UserController.GetUserProfile
);

UserRouter.delete(
  "/deleteProfile",
  authMiddleware.authorize([
    constants.USER.ROLES.USER,
    constants.USER.ROLES.ADMIN,
  ]),
  UserController.DeleteUserProfile
);

module.exports = UserRouter;
