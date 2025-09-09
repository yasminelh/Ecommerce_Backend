const verifySignUp = require("../middleware/verifySignUp");

const authcontroller = require("../controllers/auth.controller");
//const { accepts } = require("express/lib/request");
const AuthJwt = require("../middleware/authJwt");
const { user } = require("../models");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token,Origin , Content-TypeError, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [verifySignUp.checkDuplicateUsernameOrEmail],
    authcontroller.signup
  );
  app.post("/api/auth/login", authcontroller.login);
  app.post(
    "/api/auth/signout",
    [AuthJwt.verifyToken, AuthJwt.isAdminOrClient],
    authcontroller.signout
  );
  app.post(
    "/api/auth/requestPasswordReset",
    authcontroller.requestPasswordReset
  );
  app.post("/api/auth/ResetPassword", authcontroller.ResetPassword);
};
