const express = require("express");
const blogController = require("./blog.controller");
const commonMiddleware = require("../common/common.middleware");
const authMiddleware = require("../auth/auth.middleware");
const constants = require("../../constants");

const BlogRouter = express.Router();

BlogRouter.post(
  "/createBlog",
  authMiddleware.authorize([constants.USER.ROLES.ADMIN]),
  commonMiddleware.multerUploader.single("blogBanner"),
  blogController.CreateBlog
);

BlogRouter.get("/getAllBlogs", blogController.GetAllBlogs);

BlogRouter.get("/getRecentBlogs", blogController.GetAllRecentBlogs);

BlogRouter.get("/getTotalBlogs", blogController.GetTotalBlogs);

BlogRouter.get("/getTodaysBlogs", blogController.GetTodaysBlogs);

BlogRouter.delete(
  "/deleteBlog/:id",
  authMiddleware.authorize([constants.USER.ROLES.ADMIN]),
  blogController.DeleteBlog
);

BlogRouter.get("/getBlog/:id", blogController.GetBlogById);

//set multer to upload image and pdf file
BlogRouter.patch(
  "/updateBlog/:id",
  authMiddleware.authorize([constants.USER.ROLES.ADMIN]),
  commonMiddleware.multerUploader.single("blogBanner"),
  blogController.UpdateBlog
);

module.exports = BlogRouter;
