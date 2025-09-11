const AuthJwt = require("../middleware/authJwt");
const panierController = require("../controllers/panier.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token,Origin,Content-TypeError,Accept"
    );
    next();
  });

  app.post("/api/panier/addToCart", panierController.addToCart);

  app.get(
    "/api/panier/GetUserCart/:id",
    [AuthJwt.verifyToken, AuthJwt.isAdminOrClient],
    panierController.GetUserCart
  );
  app.post("/api/panier/RemoveCartItem/:id", panierController.RemoveCartItem);

  app.post("/api/panier/ClearCart/:id", panierController.ClearCart);

  app.post(
    "/api/panier/GetNombreProduitDansPanier/:id",
    panierController.GetNombreProduitDansPanier
  );
};
