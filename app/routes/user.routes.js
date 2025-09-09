const verifySignUp = require("../middleware/verifySignUp");

const usercontroller = require("../controllers/user.controller");

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

  app.put(
    "/api/user/UpdateUser/:id",
    [AuthJwt.verifyToken, AuthJwt.isAdminOrClient],
    usercontroller.upload,
    usercontroller.UpdateUser
  );
};
