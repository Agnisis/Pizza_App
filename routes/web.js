// all web related routes
const authController = require('../app/http/controllers/authControllers')
const cartController = require('../app/http/controllers/customers/cartController')
const homeController=require('../app/http/controllers/homeController')
const guest=require('../app/http/middlewares/guest')
const auth=require('../app/http/middlewares/auth')

const orderController=require('../app/http/controllers/customers/orderContoller')
const AdminOrderController=require('../app/http/controllers/admin/orderContoller')

function initRoutes(app) {
     
    app.get('/',homeController().index )
    
    app.get('/login',guest, authController().login)
    app.post('/login',authController().postLogin)


    app.get('/register',guest,authController().register)
    app.post('/register',authController().postRegister)

    app.post('/logout',authController().logout)


    app.get('/cart',cartController().index)
    app.post('/update-cart',cartController().update)


    //customer routes
    app.post('/orders',auth,orderController().store)
    app.get('/customer/orders',auth,orderController().index)


    //admin routes
    app.get('/admin/orders',auth,AdminOrderController().index)

    
}


module.exports = initRoutes