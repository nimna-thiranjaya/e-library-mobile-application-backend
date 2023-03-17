const Book = require("./book.model");

//create book
const save = async (book, session) => {
  return await book.save({ session });
};

const findAll = async (queryObj) => {
  return await Book.find(queryObj);
};

const findById = async (id) => {
  return await Book.findById(id);
};

const findByIdAndDelete = async (id, session) => {
  if (session) {
    return await Book.findByIdAndDelete(id).session(session);
  } else {
    return await Book.findByIdAndDelete(id);
  }
};
module.exports = {
  save,
  findAll,
  findById,
  findByIdAndDelete,
};
