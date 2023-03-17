const express = require("express");
const bookController = require("./book.controller");
const commonMiddleware = require("../common/common.middleware");
const authMiddleware = require("../auth/auth.middleware");
const constants = require("../../constants");

const BookRouter = express.Router();

BookRouter.post(
  "/createBook",
  authMiddleware.authorize([constants.USER.ROLES.ADMIN]),
  commonMiddleware.multerUploader.array("files", 2),
  bookController.CreateBook
);

BookRouter.get("/getAllBooks", bookController.GetAllBooks);

BookRouter.delete(
  "/deleteBook/:id",
  authMiddleware.authorize([constants.USER.ROLES.ADMIN]),
  bookController.DeleteBook
);

module.exports = BookRouter;
