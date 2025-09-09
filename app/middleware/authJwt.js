const jwt = require("jsonwebtoken");

const db = require("../models");
const { user, tokenBlackList, role } = db;

verifyToken = async (req, res, next) => {
  const token = req.headers["x-accees-token"];

  if (!token) {
    return res.status(403).send({ message: "no token provide!" });
  }
  try {
    const tokenBlackListEntry = await tokenBlackList.findOne({
      where: { token: token },
    });
    if (tokenBlackListEntry) {
      return res.status(403).send({ message: "token is BlackListed !!" });
    }
  } catch (error) {
    return res.status(500).send({ message: "internal server error" });
  }

  jwt.verify(token, process.env.SecretKeyToken, (err, decoded) => {
    if (err) return res.status(401).send({ message: "non autorisé" });
    req.user_id = decoded.id;
    req.role = decoded.role;
    next();
  });
};
isAdmin = async (req, res, next) => {
  try {
    const role = req.role;
    const adminuser = await user.findByPk(req.user_id);
    if (!adminuser || role !== "admin") {
      return res.status(403).send({ message: "you are not admin" });
    }
    next();
  } catch (error) {
    return res.status(500).send({ message: "internal server error" });
  }
};

isAdminOrClient = async (req, res, next) => {
  try {
    const role = req.role;
    const users = await user.findByPk(req.user_id);
    if (!users || (role !== "admin" && role !== "client")) {
      return res.status(403).send({ message: "you are not admin or client" });
    }
    next();
  } catch (error) {
    return res.status(500).send({ message: "internal server error" });
  }
};
AuthJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isAdminOrClient: isAdminOrClient,
};
module.exports = AuthJwt;
