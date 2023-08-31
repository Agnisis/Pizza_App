// all web related routes
const authController = require("../app/http/controllers/authControllers");
const cartController = require("../app/http/controllers/customers/cartController");
const homeController = require("../app/http/controllers/homeController");
const guest = require("../app/http/middlewares/guest");
const auth = require("../app/http/middlewares/auth");
const admin = require("../app/http/middlewares/admin");
const orderController = require("../app/http/controllers/customers/orderContoller");
const AdminOrderController = require("../app/http/controllers/admin/orderContoller");
const statusController = require("../app/http/controllers/admin/statusController");
const otherController = require("../app/http/controllers/otherController");

function initRoutes(app) {
  app.get("/", homeController().index);
  app.get("/others", otherController().index);


  app.get("/login", guest, authController().login);
  app.post("/login", authController().postLogin);

  app.get("/register", guest, authController().register);
  app.post("/register", authController().postRegister);

  app.post("/logout", authController().logout);

  app.get("/cart", cartController().index);
  app.post("/update-cart", cartController().update);

  //customer routes
  app.post("/orders", auth, orderController().store);
  app.get("/customer/orders", auth, orderController().index);
  app.get("/customer/orders/:id", auth, orderController().show); //: for dynamic id

  //admin routes
  app.get("/admin/orders", admin, AdminOrderController().index);
  app.post("/admin/order/status", admin, statusController().update);
}

module.exports = initRoutes;
