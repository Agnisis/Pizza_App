// all web related routes

function initRoutes(app) {

    app.get('/', (req, res) => {
        // res.snde("Hello from server");
        res.render('home');
    })
    app.get('/cart', (req, res) => {
        res.render('customers/cart')
    })

    app.get('/login', (req, res) => {
        res.render('auth/login')
    })

    app.get('/register', (req, res) => {
        res.render('auth/register')
    })
}


module.exports = initRoutes