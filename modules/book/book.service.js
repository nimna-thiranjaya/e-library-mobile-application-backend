const Book = require("./book.model");

//create book
const save = async (book, session) => {
  return await book.save({ session });
};

module.exports = {
  save,
};
