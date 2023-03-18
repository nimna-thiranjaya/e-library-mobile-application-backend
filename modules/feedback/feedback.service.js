const Feedback = require("./feedback.model");

const Save = async (feedback) => {
  const createdFeedback = await feedback.save();
  return createdFeedback;
};

const findAll = async (queryObj) => {
  return await Feedback.find(queryObj).populate("user").sort({ createdAt: -1 });
};

const findById = async (id, session) => {
  if (session) {
    return Feedback.findById(id).session(session);
  } else {
    return Feedback.findById(id);
  }
};

const findByIdAndDelete = async (id, session) => {
  if (session) {
    return await Feedback.findByIdAndDelete(id).session(session);
  } else {
    return await Feedback.findByIdAndDelete(id);
  }
};

module.exports = {
  Save,
  findAll,
  findById,
  findByIdAndDelete,
};
