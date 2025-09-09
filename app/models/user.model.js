const { Sequelize } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, Datatypes) => {
  const User = sequelize.define("users", {
    user_id: {
      type: Datatypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    username: {
      type: Datatypes.STRING,
    },
    email: {
      type: Datatypes.STRING,
    },
    password: {
      type: Datatypes.STRING,
    },
    telephone: {
      type: Datatypes.STRING,
    },
    adresse: {
      type: Datatypes.STRING,
    },
    photo_profil: {
      type: Datatypes.STRING,
    },
    is_active: {
      type: Datatypes.BOOLEAN,
      defaultValue: true,
    },
    is_verified: {
      type: Datatypes.BOOLEAN,
      defaultValue: false,
    },
    verificationToken: {
      type: Datatypes.STRING,
      allowNull: true,
    },
    verificationCode: {
      type: Datatypes.STRING,
      allowNull: true,
    },
    resetToken: {
      type: Datatypes.STRING,
      allowNull: true,
    },
    resetTokenExpiry: {
      type: Datatypes.DATE,
      allowNull: true,
    },
  });
  return User;
};
