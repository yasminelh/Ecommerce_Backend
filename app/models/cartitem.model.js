const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, Datatypes) => {
  const CartItem = sequelize.define("cart_items", {
    quantite: {
      type: Datatypes.INTEGER,
      allowNull: false,
    },
  });

  return CartItem;
};
