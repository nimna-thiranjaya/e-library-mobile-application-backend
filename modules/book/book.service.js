const Book = require("./book.model");

//create book
const save = async (book, session) => {
  return await book.save({ session });
};

const findAll = async (queryObj) => {
  return await Book.find(queryObj);
};

module.exports = {
  save,
  findAll,
};
