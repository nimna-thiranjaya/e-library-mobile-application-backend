const User = require("./user.model");

const save = async (user, session) => {
  return await user.save({ session });
};

const findById = async (id, session) => {
  if (session) {
    return await User.findById(id).session(session);
  } else {
    return await User.findById(id);
  }
};

const findByIdAndDelete = async (id, session) => {
  if (session) {
    return await User.findByIdAndDelete(id).session(session);
  } else {
    return await User.findByIdAndDelete(id);
  }
};

//Get all user count not including admin
const userCount = async (obj) => {
  return await User.find(obj).countDocuments();
};

module.exports = {
  save,
  findById,
  findByIdAndDelete,
  userCount,
};
