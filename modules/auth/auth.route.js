const express = require("express");
const authController = require("./auth.controller");

const AuthRouter = express.Router();

AuthRouter.post("/login", authController.LoginUser);

module.exports = AuthRouter;
