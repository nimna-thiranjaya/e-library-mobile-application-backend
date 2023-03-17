const Auth = require("./auth.model");

const save = async (auth, session) => {
  return await auth.save({ session });
};

const findById = async (id, session) => {
  if (session) {
    return await Auth.findById(id).session(session);
  } else {
    return await Auth.findById(id);
  }
};

const findByIdAndDelete = async (id, session) => {
  if (session) {
    return await Auth.findByIdAndDelete(id).session(session);
  } else {
    return await Auth.findByIdAndDelete(id);
  }
};

module.exports = { save, findById, findByIdAndDelete };
