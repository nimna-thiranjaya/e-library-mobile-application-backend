const { StatusCodes } = require("http-status-codes");
const { startSession } = require("mongoose");
const commonUtils = require("../common/common.util");
const commonService = require("../common/common.service");
const Book = require("./book.model");
const Auth = require("../auth/auth.model");
const BookService = require("./book.service");
const AuthService = require("../auth/auth.service");

// Error messages
const BadRequestError = require("../error/error.classes/BadRequestError");
const NotFoundError = require("../error/error.classes/NotFoundError");

//create book
const CreateBook = async (req, res) => {
  const book = new Book(req.body);

  //get all files and validate as a image file and pdf file
  const files = req.files;
  let bannerFile = null;
  let pdfFile = null;

  for (const file of files) {
    if (file.mimetype.split("/")[0] == "image") {
      bannerFile = file;
    }

    if (file.mimetype.split("/")[0] == "application") {
      pdfFile = file;
    }
  }

  if (!bannerFile) {
    throw new BadRequestError("Please upload a banner image");
  }

  if (!pdfFile) {
    throw new BadRequestError("Please upload a pdf file");
  }

  let createdBook = null;

  //start mongoose default session to handle transactions
  const session = await startSession();
  try {
    //start transaction
    session.startTransaction();

    //construct image name
    const imageName = `BookBanner_${book._id}_${Date.now()}`;
    const banner = commonUtils.generateFirebaseStorageURL(imageName);

    //construct pdf name
    const pdfName = `BookPdf_${book._id}_${Date.now()}`;
    const pdf = commonUtils.generateFirebaseStorageURL(pdfName);

    //set book banner and pdf
    book.bookBanner = banner;
    book.eBook = pdf;

    //save book
    createdBook = await BookService.save(book, session);

    //upload image to firebase storage
    await commonService.uploadToFirebase(bannerFile, banner);

    //upload pdf to firebase storage
    await commonService.uploadToFirebase(pdfFile, pdf);

    //commit transaction
    await session.commitTransaction();

    //send response
    res.status(StatusCodes.CREATED).json({
      message: "Book created successfully",
      book: createdBook,
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

//get all books
const GetAllBooks = async (req, res) => {
  //get all books
  const books = await BookService.findAll();

  //send response
  res.status(StatusCodes.OK).json({
    message: "Books fetched successfully",
    books,
  });
};

module.exports = {
  CreateBook,
  GetAllBooks,
};
