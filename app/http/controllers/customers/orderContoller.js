const Order = require('../../../models/order')
function orderController() {
    return {
        store(req, res) {
            // console.log(req.body)
            //validate req
            const { phone, address } = req.body
            if (!phone || !address) {
                req.flash('error', "All fields are required")
                return react.redirect('/cart')
            }
            const order = new Order({
                customerId: req.user._id,//by passporyt js
                items: req.session.cart.items,  //from sessions
                phone,
                address
            })
            order.save().then(result => {
                req.flash('sucess', "order Placed Succesfully")
                res.redirect('/')
            }).catch(err => {
                req.flash('error', "Something Went Wrong")
                return res.redirect('/cart')
            })

        },
    
        async index(req, res) { // Make the function asynchronous
        try {
            const orders = await Order.find({ customerId: req.user._id });
            
            res.render('customers/orders',{orders:orders})
            // Handle and send the orders to the client as needed
            
        } catch (error) {
            console.error(error);
            req.flash('error', 'Error fetching orders');
            res.redirect('/');
        }
    }
}
}







module.exports = orderController