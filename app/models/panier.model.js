const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, Datatypes) => {
  const Panier = sequelize.define("paniers", {
    panier_id: {
      type: Datatypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    total: {
      type: Datatypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    est_commande: {
      type: Datatypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return Panier;
};
