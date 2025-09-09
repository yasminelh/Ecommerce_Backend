const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, Datatypes) => {
  const Categorie = sequelize.define("categories", {
    categorie_id: {
      type: Datatypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    nom: {
      type: Datatypes.STRING,
      allowNull: false,
    },
  });

  return Categorie;
};
