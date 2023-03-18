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

  //get all files and validate as a image file and pdf file
  const files = req.files;
  let blogImg = null;
  let pdfFile = null;

  for (const file of files) {
    if (file.mimetype.split("/")[0] == "image") {
      blogImg = file;
    }

    if (file.mimetype.split("/")[0] == "application") {
      pdfFile = file;
    }
  }

  if (!blogImg) {
    throw new BadRequestError("Please upload a blog image");
  }

  if (!pdfFile) {
    throw new BadRequestError("Please upload a pdf file");
  }

  let createBlog = null;

  //start mongoose default session to handle transactions
  const session = await startSession();
  try {
    //start transaction
    session.startTransaction();

    //construct image name
    const imageName = `BlogBanner_${blog._id}_${Date.now()}`;
    const banner = commonUtils.generateFirebaseStorageURL(imageName);

    //construct pdf name
    const pdfName = `BlogPdf_${blog._id}_${Date.now()}`;
    const pdf = commonUtils.generateFirebaseStorageURL(pdfName);

    //set blog banner and pdf
    blog.blogBanner = banner;
    blog.eblog = pdf;

    //save blog
    createBlog = await BlogService.save(blog, session);

    //upload image to firebase storage
    await commonService.uploadToFirebase(blogImg, banner);

    //upload pdf to firebase storage
    await commonService.uploadToFirebase(pdfFile, pdf);

    //commit transaction
    await session.commitTransaction();

    //send response
    res.status(StatusCodes.CREATED).json({
      message: "Blog created successfully",
      blog: createBlog,
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

//get all blogs
const GetAllBlogs = async (req, res) => {
  const blogs = await BlogService.getAll();

  res.status(StatusCodes.OK).json({
    message: "Blogs fetched successfully",
    blogs: blogs,
  });
};

//get blog by id
const GetBlogById = async (req, res) => {
  const blogId = req.params.id;
  const blog = await BlogService.getById(blogId);

  if (!blog) {
    throw new NotFoundError("Blog not found");
  }
  //send response
  res.status(StatusCodes.OK).json({
    message: "Blog fetched successfully",
    blog: blog,
  });
};

//update blog
const UpdateBlog = async (req, res) => {
  const blogId = req.params.id;
  const blog = await BlogService.getById(blogId);

  if (!blog) {
    throw new NotFoundError("Blog not found");
  }

  //get all files and validate as a image file and pdf file
  const files = req.files;
  let blogImg = null;
  let pdfFile = null;

  for (const file of files) {
    if (file.mimetype.split("/")[0] == "image") {
      blogImg = file;
    }

    if (file.mimetype.split("/")[0] == "application") {
      pdfFile = file;
    }
  }

  //start mongoose default session to handle transactions
  const session = await startSession();
  try {
    //start transaction
    session.startTransaction();

    //construct image name
    const imageName = `BlogBanner_${blog._id}_${Date.now()}`;
    const banner = commonUtils.generateFirebaseStorageURL(imageName);

    //construct pdf name
    const pdfName = `BlogPdf_${blog._id}_${Date.now()}`;
    const pdf = commonUtils.generateFirebaseStorageURL(pdfName);

    //set blog banner and pdf
    blog.blogBanner = banner;
    blog.eblog = pdf;

    //save blog
    createBlog = await BlogService.save(blog, session);

    //upload image to firebase storage
    await commonService.uploadToFirebase(blogImg, banner);

    //upload pdf to firebase storage
    await commonService.uploadToFirebase(pdfFile, pdf);

    //commit transaction
    await session.commitTransaction();

    //send response
    res.status(StatusCodes.CREATED).json({
      message: "Blog created successfully",
      blog: createBlog,
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

//delete blog
const DeleteBlog = async (req, res) => {
  const blogId = req.params.id;
  const blog = await BlogService.getById(blogId);

  if (!blog) {
    throw new NotFoundError("Blog not found");
  }

  //start mongoose default session to handle transactions
  const session = await startSession();
  try {
    //start transaction
    session.startTransaction();

    //delete blog
    await BlogService.delete(blog, session);

    //commit transaction
    await session.commitTransaction();

    //send response
    res.status(StatusCodes.OK).json({
      message: "Blog deleted successfully",
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
  CreateBlog,
  GetAllBlogs,
  GetBlogById,
  UpdateBlog,
  DeleteBlog,
};
