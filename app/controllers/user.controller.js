const db = require("../models");

const { user, role } = db;
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcryptjs");

exports.UpdateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { username, email, telephone, adresse, password } = req.body;
    const photo_profil = req.file ? req.file.path : null;

    if (!id) {
      return res.status(400).send({ message: "id is required" });
    }

    const users = await user.findByPk(id);
    if (!users) {
      return res.status(404).send({ message: "user not found " });
    }

    if (password) {
      const hashpassword = await bcrypt.hashSync(password, 10);
      users.password = hashpassword || users.password;
    }
    users.username = username || users.username;
    users.email = email || users.email;

    users.telephone = telephone || users.telephone;
    users.adresse = adresse || users.adresse;

    if (photo_profil) {
      users.photo_profil = photo_profil;
    }
    const result = await users.save();
    return res
      .status(200)
      .send({ message: "utlisateur mis a jour avec succès " });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
exports.upload = multer({
  storage: storage,
  limits: { fileSize: "10000000" },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("give proper file formate (jpeg|jpg|png) to upload");
  },
}).single("photo_profil");
