const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, Datatypes) => {
  const Produit = sequelize.define("produits", {
    produit_id: {
      type: Datatypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    name: {
      type: Datatypes.STRING,
      allowNull: false,
    },
    description: {
      type: Datatypes.TEXT,
      allowNull: false,
    },
    prix: {
      type: Datatypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stock: {
      type: Datatypes.INTEGER,
      defaultValue: 0,
    },
    image: {
      type: Datatypes.STRING,
      allowNull: true,
    },
    est_disponible: {
      type: Datatypes.BOOLEAN,
      defaultValue: true,
    },
  });

  return Produit;
};
