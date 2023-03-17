const Book = require("./book.model");

/**
 * @param {Book} book
 * @param {import("mongoose").ClientSession} session
 * @returns {Promise<Book>}
 */
const save = async (book, session) => {
  return await book.save({ session });
};

/**
 * @param {Object} queryObj
 * @returns {Promise<Book[]>}
 */
const findAll = async (queryObj) => {
  return await Book.find(queryObj);
};

/**
 * @param {string} id
 * @returns {Promise<Book>}
 */
const findById = async (id) => {
  return await Book.findById(id);
};

/**
 * @param {string} id
 * @param {import("mongoose").ClientSession} session
 * @returns {Promise<Book>}
 */
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
