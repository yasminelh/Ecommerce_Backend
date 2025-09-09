const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, Datatypes) => {
  const Commande = sequelize.define("commandes", {
    commande_id: {
      type: Datatypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    status: {
      type: Datatypes.STRING,
      defaultValue: "en attente",
    },
    montant_total: {
      type: Datatypes.DECIMAL(10, 2),
      allowNull: false,
    },
    date_commande: {
      type: Datatypes.DATE,
      defaultValue: Datatypes.NOW,
    },
    adresse_livraison: {
      type: Datatypes.STRING,
      allowNull: false,
    },
  });

  return Commande;
};
