const Blog = require("./blog.model");

/**
 * @param {Object} blog
 * @param {Object} session
 * @returns {Promise<Blog>}
 */
const save = async (blog, session) => {
  return await blog.save({ session });
};

/**
 * @param {Object} queryObj
 * @returns {Promise<Blog[]>}
 */
const findAll = async (queryObj) => {
  return await Blog.find(queryObj).populate("blogAuthor");
};

/**
 * @param {Object} queryObj
 * @returns {Promise<Blog[]>}
 */

//Get only first 3 blogs
const findAllSorted = async (queryObj) => {
  return await Blog.find(queryObj)
    .sort({ createdAt: -1 })
    .limit(3)
    .populate("blogAuthor");
};

/**
 * @param {*} id
 * @returns {Promise<Blog>}
 */
const findById = async (id) => {
  return await Blog.findById(id);
};

/**
 * @param {Object} id
 * @param {Object} session
 * @returns {Promise<Blog>}
 */
const findByIdAndDelete = async (id, session) => {
  if (session) {
    return await Blog.findByIdAndDelete(id).session(session);
  } else {
    return await Blog.findByIdAndDelete(id);
  }
};

module.exports = {
  save,
  findAll,
  findById,
  findByIdAndDelete,
  findAllSorted,
};
