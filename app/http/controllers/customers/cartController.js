function cartController() {
  return {
    index(req, res) {
      const cart = req.session.cart || {
        items: {},
        totalQty: 0,
        totalPrice: 0,
      };
      const itemIds = Object.keys(cart.items);
      res.render("customers/cart", { cart, itemIds });
    },
    update(req, res) {
      if (!req.session.cart) {
        req.session.cart = {
          items: {},
          totalQty: 0,
          totalPrice: 0,
        };
      }

      let cart = req.session.cart;

      if (!cart.items[req.body._id]) {
        cart.items[req.body._id] = {
          item: req.body,
          qty: 1,
        };

        if (req.body.type) {
          cart.items[req.body._id].item.type = req.body.type;
        }

        cart.totalQty = cart.totalQty + 1;
        cart.totalPrice = cart.totalPrice + req.body.price;
      } else {
        cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
        cart.totalQty = cart.totalQty + 1;
        cart.totalPrice = cart.totalPrice + req.body.price;
      }

      return res.json({ totalQty: req.session.cart.totalQty });
    },
  };
}

module.exports = cartController;
