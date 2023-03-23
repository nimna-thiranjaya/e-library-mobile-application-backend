const { StatusCodes } = require("http-status-codes");
const { startSession } = require("mongoose");
const commonUtils = require("../common/common.util");
const commonService = require("../common/common.service");
const Blog = require("./blog.model");
const Auth = require("../auth/auth.model");
const BlogService = require("./blog.service");

// Error messages
const BadRequestError = require("../error/error.classes/BadRequestError");
const NotFoundError = require("../error/error.classes/NotFoundError");

//create Blog
const CreateBlog = async (req, res) => {
  const blog = new Blog(req.body);
  console.log(req.file);
  //get all files and validate as a image file and pdf file
  if (!req.file) {
    throw new BadRequestError("Please upload an image");
  }

  if (req.file.mimetype.split("/")[0] !== "image") {
    throw new BadRequestError("Only images are permitted!");
  }

  const auth = req.auth;

  try {
    //Construct blog object
    blog.blogAuthor = auth.id;

    //construct image name
    const imageName = `BlogImage_${blog._id}_${Date.now()}`;
    blog.blogImage = commonUtils.generateFirebaseStorageURL(imageName);

    //save blog
    const createdBlog = await BlogService.save(blog);

    //upload image to firebase storage
    await commonService.uploadToFirebase(req.file, imageName);

    //send response
    res.status(StatusCodes.CREATED).json({
      message: "Blog Published successfully",
      blog: createdBlog,
    });
  } catch (error) {
    throw error;
  }
};

//get all blogs
const GetAllBlogs = async (req, res) => {
  const blogs = await BlogService.findAll();

  res.status(StatusCodes.OK).json({
    message: "Blogs fetched successfully",
    blogs: blogs,
  });
};

//get all recent blogs
const GetAllRecentBlogs = async (req, res) => {
  const blogs = await BlogService.findAllSorted();

  res.status(StatusCodes.OK).json({
    message: "Blogs fetched successfully",
    blogs: blogs,
  });
};

//Update Blog
const UpdateBlog = async (req, res) => {
  const blogId = req.params.id;
  const blog = await BlogService.findById(blogId);

  blog.set(req.body);

  //get all files and validate as a image file and pdf file
  if (req.file) {
    if (req.file.mimetype.split("/")[0] !== "image") {
      throw new BadRequestError("Only images are permitted!");
    }

    //construct image name
    const imageName = `BlogImage_${blog._id}_${Date.now()}`;
    blog.blogImage = commonUtils.generateFirebaseStorageURL(imageName);

    //upload image to firebase storage
    await commonService.uploadToFirebase(req.file, imageName);
  }
  //save blog
  const updatedBlog = await BlogService.save(blog);

  //send response
  res.status(StatusCodes.OK).json({
    message: "Blog updated successfully",
    blog: updatedBlog,
  });
};

//get blog by id
const GetBlogById = async (req, res) => {
  const blogId = req.params.id;
  const blog = await BlogService.findById(blogId);

  if (!blog) {
    throw new NotFoundError("Blog not found");
  }

  res.status(StatusCodes.OK).json({
    message: "Blog fetched successfully",
    blog: blog,
  });
};

//delete blog
const DeleteBlog = async (req, res) => {
  const blogId = req.params.id;

  const blog = await BlogService.findById(blogId);

  if (!blog) {
    throw new NotFoundError("Blog not found");
  }
  await BlogService.findByIdAndDelete(blogId);

  res.status(StatusCodes.OK).json({
    message: "Blog deleted successfully",
  });
};

module.exports = {
  CreateBlog,
  GetAllBlogs,
  GetBlogById,
  UpdateBlog,
  DeleteBlog,
  GetAllRecentBlogs,
};
