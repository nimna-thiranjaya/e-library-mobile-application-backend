const { StatusCodes } = require("http-status-codes");
const { startSession } = require("mongoose");
const commonUtils = require("../common/common.util");
const commonService = require("../common/common.service");
const Book = require("./book.model");
const BookService = require("./book.service");

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
  const category = req.query.category;

  //get all books
  const books = await BookService.findAll();

  let filteredBooks = books;
  //filter books by category
  if (category) {
    filteredBooks = books.filter((book) =>
      book.bookCategories
        .map((element) => {
          return element.toLowerCase();
        })
        .includes(category.toLowerCase())
    );
  }

  //send response
  res.status(StatusCodes.OK).json({
    message: "Books fetched successfully",
    filteredBooks,
  });
};

//delete book
const DeleteBook = async (req, res) => {
  const id = req.params.id;

  //get and validate book
  const book = await BookService.findById(id);

  if (!book) {
    throw new NotFoundError("Book not found");
  }

  //delete book
  await BookService.findByIdAndDelete(id);

  //send response
  res.status(StatusCodes.OK).json({
    message: "Book deleted successfully",
  });
};

const GetBook = async (req, res) => {
  const id = req.params.id;

  //get and validate book
  const book = await BookService.findById(id);

  if (!book) {
    throw new NotFoundError("Book not found");
  }

  //send response
  res.status(StatusCodes.OK).json({
    book,
  });
};

//update book
const UpdateBook = async (req, res) => {
  const id = req.params.id;

  //get and validate book
  const book = await BookService.findById(id);

  if (!book) {
    throw new NotFoundError("Book not found");
  }

  //get all files and validate as a image file and pdf file
  const files = req.files;

  let newBannerFile = null;
  let newPdfFile = null;

  for (const file of files) {
    if (file.mimetype.split("/")[0] == "image") {
      newBannerFile = file;
    }

    if (file.mimetype.split("/")[0] == "application") {
      newPdfFile = file;
    }
  }

  //start mongoose default session to handle transactions

  const session = await startSession();
  try {
    //start transaction
    session.startTransaction();

    //update book
    book.set(req.body);

    if (newBannerFile) {
      //construct image name
      const imageName = `BookBanner_${book._id}_${Date.now()}`;
      const banner = commonUtils.generateFirebaseStorageURL(imageName);

      //set book banner
      book.bookBanner = banner;

      //upload image to firebase storage
      await commonService.uploadToFirebase(newBannerFile, banner);
    }

    if (newPdfFile) {
      //construct pdf name
      const pdfName = `BookPdf_${book._id}_${Date.now()}`;
      const pdf = commonUtils.generateFirebaseStorageURL(pdfName);

      //set book pdf
      book.eBook = pdf;

      //upload pdf to firebase storage
      await commonService.uploadToFirebase(newPdfFile, pdf);
    }

    //save book
    await BookService.save(book, session);

    //commit transaction
    await session.commitTransaction();

    //send response
    res.status(StatusCodes.OK).json({
      message: "Book updated successfully",
      book,
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
  CreateBook,
  GetAllBooks,
  DeleteBook,
  GetBook,
  UpdateBook,
};
