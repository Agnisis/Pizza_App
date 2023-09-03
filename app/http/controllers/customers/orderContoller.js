const Order = require("../../../models/order");
const moment = require("moment");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

function orderController() {
  return {
    async store(req, res) {
      try {
        // Validate request data
        const { phone, address, stripeToken, paymentType } = req.body;
        if (!phone || !address) {
          return res.status(422).json({ message: "All fields are required" });
        }

        const order = new Order({
          customerId: req.user._id,
          items: req.session.cart.items,
          phone,
          address,
        });

        await order.save();

        // Stripe payment processing
        if (paymentType === "card") {
          const charge = await stripe.charges.create({
            amount: req.session.cart.totalPrice * 100,
            source: stripeToken,
            currency: "inr",
            description: `Pizza order: ${order._id}`,
          });

          order.paymentStatus = true;
          order.paymentType = paymentType;
          await order.save();

          delete req.session.cart;

          return res.json({
            message: "Payment successful, Order Placed Successfully",
            order: order,
          });
        } else {
          // No payment required
          delete req.session.cart;
          return res.json({
            message: "Order placed successfully",
            order: order,
          });
        }
      } catch (error) {
        console.error(error);
        delete req.session.cart;
        return res.status(500).json({ message: "Something went wrong" });
      }
    },

    async index(req, res) {
      try {
        const orders = await Order.find({ customerId: req.user._id }).sort({
          createdAt: -1,
        });
        res.render("customers/orders", { orders, moment });
      } catch (error) {
        console.error(error);
        req.flash("error", "Error fetching orders");
        res.redirect("/");
      }
    },

    async show(req, res) {
      try {
        const order = await Order.findById(req.params.id);

        // User authorization check
        if (req.user._id.toString() === order.customerId.toString()) {
          return res.render("customers/singleOrder", { order });
        } else {
          return res.redirect("/");
        }
      } catch (error) {
        console.error(error);
        req.flash("error", "Error fetching order");
        res.redirect("/");
      }
    },
  };
}

module.exports = orderController;


