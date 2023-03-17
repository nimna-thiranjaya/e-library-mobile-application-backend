const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const comparePassword = async (password, encryptedPassword) => {
  return await bcrypt.compare(password, encryptedPassword);
};

const signToken = (user) => {
  const maxAge = 24 * 7 * 60 * 60; //for 7 days

  //create token body
  const tokenBody = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(tokenBody, process.env.JWT_SECRET_KEY, {
    expiresIn: maxAge,
  });
};

const extractToken = (bearerToken) => {
  const bearerArr = bearerToken.split(" ");
  if (bearerArr.length !== 2) return null;
  return bearerArr[1];
};

module.exports = {
  comparePassword,
  signToken,
  extractToken,
};
