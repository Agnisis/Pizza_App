const Order = require("../../../models/order");
const moment = require("moment");

function orderController() {
  return {
    store(req, res) {
      
      //validate req
      const { phone, address } = req.body;
      if (!phone || !address) {
        req.flash("error", "All fields are required");
        return react.redirect("/cart");
      }
      const order = new Order({
        customerId: req.user._id, //by passporyt js
        items: req.session.cart.items, //from sessions
        phone,
        address,
      });
      order
        .save()
        .then((result) => {
          // req.flash("success", "order Placed Succesfully");
          delete req.session.cart;
          // res.redirect("/customer/orders");
          return res.json({message: "order Placed Succesfully"});
        })
        .catch((err) => {
          req.flash("error", "Something Went Wrong");
          return res.redirect("/cart");
        });
    },

    async index(req, res) {
      // Make the function asynchronous
      try {
        const orders = await Order.find({ customerId: req.user._id }, null, {
          sort: { createdAt: -1 },
        });

        res.render("customers/orders", { orders: orders, moment: moment });
        // Handle and send the orders to the client as needed
      } catch (error) {
        console.error(error);
        req.flash("error", "Error fetching orders");
        res.redirect("/");
      }
    },


    async show(req,res){
      const order=await Order.findById(req.params.id)
      //user authorize user
      if(req.user._id.toString()===order.customerId.toString()){
         return res.render('customers/singleOrder',{order})
      }
      
        return redirect('/')
      
    }
  };
}

module.exports = orderController;
