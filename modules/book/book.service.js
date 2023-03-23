const Book = require("./book.model");

/**
 *
 * @param {*} book
 * @param {*} session
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
  return await Book.find(queryObj).sort({ createdAt: -1 });
};

/**
 *
 * @param {*} id
 * @returns {Promise<Book>}
 */
const findById = async (id) => {
  return await Book.findById(id);
};

/**
 * @param {*} id
 * @param {*} session
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
