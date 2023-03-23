const { StatusCodes } = require("http-status-codes");
const authService = require("./auth.service");
const authUtil = require("./auth.util");

//// Error messages
const BadRequestError = require("../error/error.classes/BadRequestError");
const UnauthorizedError = require("../error/error.classes/UnauthorizedError");
const NotFoundError = require("../error/error.classes/NotFoundError");

const LoginUser = async (req, res) => {
  const { email, password } = req.body;

  //email and password validation
  if (!email || !password) {
    throw new BadRequestError("Email and password are required!");
  }

  //check if user exists
  const isAuthCheck = await authService.findById(email);

  if (!isAuthCheck) {
    throw new NotFoundError("Invalid Email!");
  }

  //check if password is correct
  const isPasswordCorrect = await authUtil.comparePassword(
    password,
    isAuthCheck.password
  );

  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Invalid Password");
  }

  //populate user
  const dbPopulatedUser = await isAuthCheck.populate("user");

  //generate token
  const token = authUtil.signToken(dbPopulatedUser.user);

  return res
    .status(StatusCodes.OK)
    .setHeader("authorization", `Bearer ${token}`)
    .json({
      message: "Login Successful",
      role: dbPopulatedUser.user.role,
      token: token,
    });
};

module.exports = {
  LoginUser,
};
