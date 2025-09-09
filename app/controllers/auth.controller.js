const db = require("../models");
const { user, role, tokenBlackList } = db;

const bcrypt = require("bcryptjs");

const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const sendMail = require("../config/SendEmail");

const { emailTemplate } = require("../config/EmailTemplate");
const { EmailResetPassword } = require("../config/EmailResetPassword");
const { Op } = require("sequelize");

exports.signup = async (req, res) => {
  try {
    const requestFields = [
      "username",
      "email",
      "password",
      "telephone",
      "adresse",
      "role_Id",
    ];

    for (const field of requestFields) {
      if (!req.body[field]) {
        return res.status(400).send({ message: `le champ ${field} est vide` });
      }
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const NewUser = await user.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      telephone: req.body.telephone,
      adresse: req.body.adresse,
      verificationToken,
      verificationCode,
      is_verified: false,
      role_Id: req.body.role_Id,
    });

    const verificationLink = `http://localhost:4200/verify-email?token=${verificationToken}`;

    const htmlContent = emailTemplate(
      NewUser.username,
      verificationLink,
      verificationCode
    );

    await sendMail(NewUser.email, "verification email", htmlContent);

    return res.status(200).send({
      message:
        "inscription réussit ! verifier votre email pour activer votre compte ",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ message: "email or password incorrect " });
    }

    const user = await db.user.findOne({
      attributes: [
        "user_id",
        "username",
        "password",
        "is_verified",
        "is_active",
      ],
      where: { email },
      include: [{ model: role, attributes: ["name"] }],
    });
    if (!user) {
      return res.status(400).send({ message: "email or password incorrect" });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res
        .status(400)
        .send({ message: "email or password are incorrect" });
    }

    console.log(user);

    if (!user.is_verified) {
      return res.status(400).send({ message: "email is not verified " });
    }
    if (!user.is_active) {
      return res.status(400).send({ message: "email is not active " });
    }

    const token = jwt.sign(
      { id: user.user_id, username: user.username, role: user.role.name },
      process.env.SecretKeyToken,
      { expiresIn: 86400 }
    );
    return res
      .status(200)
      .send({ user: user, token: token, role: user?.role?.name });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// exports.VerifEmail = async (req, res) => {
//   try {
//     const { verificationCode, verificationToken } = req.body;
//     if (!verificationToken || !verificationCode) {
//       return res
//         .status(400)
//         .send({ message: "verificationcode or verificationtoken are empty !" });
//     }
//     const user = await User.findOne({
//       where: { verificationToken },
//     });
//     if (!user) {
//       return res
//         .status(400)
//         .send({ message: " verificationtoken is not valid !" });
//     }

//     if (user.verificationCode != verificationCode) {
//       return res
//         .status(400)
//         .send({ message: " verificationcode is not valid !" });
//     }

//     user.verificationCode = null;
//     user.verificationToken = null;
//     user.is_verified = true;
//     await user.save();
//     return res
//       .status(200)
//       .send({ message: " email verified suuccessfully  !" });
//   } catch (error) {
//     return res.status(500).send(error.message);
//   }
// };

exports.signout = async (req, res) => {
  try {
    const { token, user_id } = req.body;
    if (!token || !user_id) {
      return res
        .status(400)
        .send({ message: "  vtoken or user_id are missing" });
    }
    const tokenuser = await user.findByPk(user_id, {
      attributes: ["user_id"],
    });

    if (!tokenuser) {
      return res.status(400).send({ message: "user not found !" });
    }

    let tokenBlackListEntry = await tokenBlackList.findOne({
      where: {
        token,
      },
    });

    if (!tokenBlackListEntry) {
      tokenBlackListEntry = await tokenBlackList.create({
        token,
      });
      return res.status(200).send({ message: "deconnexion reussit !" });
    } else {
      return res
        .status(401)
        .send({ message: "token deja sur la liste noire !" });
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const users = await user.findOne({
      where: { email },
    });

    if (!users) {
      return res.status(400).send({ message: "user not found !" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    users.resetToken = resetToken;
    users.resetTokenExpiry = resetTokenExpiry;
    await users.save();

    const resetLink = `http://localhost:4200/reset-password?token=${resetToken}`;
    const subject = "Demande de réinitilisation du mot de passe";

    const htmlcontent = EmailResetPassword(users.username, resetLink);
    await sendMail(users.email, subject, htmlcontent);
    return res
      .status(200)
      .send({ message: "demande de reinitilisation envoyée" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.ResetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res
        .status(400)
        .send({ message: "token or password are incorrect !" });
    }
    const users = await user.findOne({
      attributes: ["user_id", "resetToken", "password", "resetTokenExpiry"],
      where: { resetToken: token, resetTokenExpiry: { [Op.gt]: new Date() } },
    });

    console.log(users);

    if (!users) {
      return res.status(400).send({ message: "token invalid or expired !" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.password = hashedPassword;
    users.resetToken = null;
    users.resetTokenExpiry = null;
    await users.save();
    return res.status(200).send({ message: "Mot de passe reinitilisé !" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
