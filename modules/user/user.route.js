const express = require("express");
const userController = require("./user.controller");
const commonMiddleware = require("../common/common.middleware");
const authMiddleware = require("../auth/auth.middleware");

const constants = require("../../constants");

const UserRouter = express.Router();

UserRouter.post(
  "/register",
  commonMiddleware.multerUploader.single("picture"),
  userController.CreateUser
);

UserRouter.get(
  "/profile",
  authMiddleware.authorize([
    constants.USER.ROLES.USER,
    constants.USER.ROLES.ADMIN,
  ]),
  userController.GetUserProfile
);

UserRouter.delete(
  "/deleteProfile",
  authMiddleware.authorize([
    constants.USER.ROLES.USER,
    constants.USER.ROLES.ADMIN,
  ]),
  userController.DeleteUserProfile
);

UserRouter.get(
  "/getTotalUsers",
  authMiddleware.authorize([constants.USER.ROLES.ADMIN]),
  userController.userCount
);

UserRouter.get(
  "/getTotalAdmins",
  authMiddleware.authorize([constants.USER.ROLES.ADMIN]),
  userController.adminCount
);

module.exports = UserRouter;
