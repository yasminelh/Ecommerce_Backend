const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, Datatypes) => {
  const OrderItem = sequelize.define("order_items", {
    quantite: {
      type: Datatypes.INTEGER,
      allowNull: false,
    },
    prix_unitaire: {
      type: Datatypes.DECIMAL(10, 2),
      allowNull: false,
    },
  });

  return OrderItem;
};
