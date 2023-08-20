const Order = require("../../../models/order");
function orderContoller() {
  return {
    index(req, res) {
      Order.find({ status: { $ne: "completed" } }, null, {
        sort: { createdAt: -1 },
      })
        .populate("customerId", "-password")
        .exec((err, orders) => {
          res.render("admin/orders");
        });
    },
  };
}
