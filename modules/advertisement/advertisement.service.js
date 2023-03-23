const Advertisement = require("./advertisement.model");

/**
 *
 * @param {*} advertisement
 * @param {*} session
 * @returns {Promise<Advertisement>}
 */
const save = async (advertisement, session) => {
  return await advertisement.save({ session });
};

/**
 * @param {Object} queryObj
 * @returns {Promise<Advertisement[]>}
 */
const findAll = async (queryObj) => {
  return await Advertisement.find(queryObj);
};

/**
 *
 * @param {*} id
 * @returns {Promise<Advertisementok>}
 */
const findById = async (id) => {
  return await Advertisement.findById(id);
};

/**
 * @param {*} id
 * @param {*} session
 * @returns {Promise<Advertisement>}
 */
const findByIdAndDelete = async (id, session) => {
  if (session) {
    return await Advertisement.findByIdAndDelete(id).session(session);
  } else {
    return await Advertisement.findByIdAndDelete(id);
  }
};

module.exports = {
  save,
  findAll,
  findById,
  findByIdAndDelete,
};
