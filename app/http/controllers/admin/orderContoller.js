const Order = require("../../../models/order");
function orderContoller() {
  return {
    // index(req, res) {
    //   Order.find({ status: { $ne: "completed" } }, null, {
    //     sort: { createdAt: -1 },
    //   })
    //     .populate("customerId", "-password")
    //     .exec((err, orders) => {
    //       if(req.xhr){
    //         return res.json(orders)
    //       }
    //       return res.render("admin/orders");
    //     });
    // },

    async index(req, res) {
      try {
        const orders = await Order.find({ status: { $ne: "completed" } })
          .sort({ createdAt: -1 })
          .populate("customerId", "-password")
          .exec();

        if (req.xhr) {
          
          return res.json(orders);
        }

        return res.render("admin/orders");
      } catch (err) {
        // Handle any errors here
        console.error(err);
        return res.status(500).json({ error: "An error occurred" });
      }
    },
  };
}


module.exports = orderContoller;