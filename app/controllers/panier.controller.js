const { panier } = require("../models");
const db = require("../models");
const User = db.user;
const Panier = db.panier;
const Produit = db.produit;
const CartItem = db.cartItem;

exports.addToCart = async (req, res) => {
  try {
    const { user_Id, produit_Id, quantite } = req.body;
    if (!user_Id || !produit_Id || !quantite === 0 || isNaN(quantite)) {
      return res.status(400).json({ message: "données invlides" });
    }
    let panier = await Panier.findOne({
      where: { user_Id, est_commande: false },
    });

    if (!panier) {
      panier = await Panier.create({ user_Id });
    }
    const produit = await Produit.findByPk(produit_Id);
    if (!produit) {
      return res.status(400).json({ message: "produit non trouvé " });
    }

    const existingItem = await CartItem.findOne({
      where: { panier_Id: panier.panier_id, produit_Id },
    });
    if (existingItem) {
      const updatedQuantite = existingItem.quantite + quantite;
      if (updatedQuantite <= 0) {
        await existingItem.destroy();
      } else {
        existingItem.quantite = updatedQuantite;
        await existingItem.save();
      }
    } else {
      if (quantite > 0) {
        await CartItem.create({
          panier_Id: panier.panier_id,
          produit_Id,
          quantite,
        });
      } else {
        return res.status(400).json({ message: "quantite invalide !" });
      }
    }

    const cartItems = await CartItem.findAll({
      where: { panier_Id: panier.panier_id },
      include: [Produit],
    });

    const total = cartItems.reduce(
      (sum, item) => sum + item.produit.prix * item.quantite,
      0
    );

    panier.total = total;
    await panier.save();
    return res.status(200).json({ message: "produit ajouté au panier" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.GetUserCart = async (req, res) => {
  try {
    const user_Id = req.params.id;
    const panier = await Panier.findOne({
      where: { user_Id },
      include: {
        model: CartItem,
        include: [Produit],
      },
    });
    if (!panier) {
      return res.status(404).json({ message: "Panier Vide !" });
    }
    return res.status(200).json(panier);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.RemoveCartItem = async (req, res) => {
  try {
    const id = req.params.id;
    const item = await CartItem.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: "Produit non trouvé !" });
    }
    const panier = await Panier.findByPk(item.panier_Id);
    await item.destroy();

    const cartItems = await CartItem.findAll({
      where: { panier_Id: panier.panier_id },
      inclde: [Produit],
    });

    const total = cartItems.reduce(
      (sum, item) => sum + item * item.produit.prix,
      0
    );
    panier.total = total;
    await panier.save();
    res.status(200).send({ message: "panier supprimé avec succées" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.ClearCart = async (req, res) => {
  try {
    const user_Id = req.params.id;
    const panier = await Panier.findOne({
      where: { user_Id, est_commande: false },
    });
    if (!panier) {
      return res.status(404).json({ message: "Panier non trouvé !" });
    }
    await CartItem.destroy({
      where: {
        panier_Id: panier.panier_id,
      },
    });
    await panier.save();
    res.status(200).send({ message: "panier supprimé avec succées" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.GetNombreProduitDansPanier = async (req, res) => {
  try {
    const user_Id = req.params.id;
    const panier = await Panier.findOne({
      where: { user_Id, est_commande: false },
      include: [
        {
          model: CartItem,
          attributes: ["quantite"],
        },
      ],
    });

    console.log(panier);

    if (!panier || !panier.cart_items) {
      return res.status(200).json({ count: 0 });
    }

    const nbproduit = panier.cart_items.reduce(
      (total, item) => total + item.quantite,
      0
    );
    return res.status(200).json({ count: nbproduit });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
