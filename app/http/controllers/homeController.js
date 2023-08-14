const Menu = require('../../models/menu')


function homeController() {

    //factory functions pattern of programs
    return {
        async index(req, res) {

            const pizzas = await Menu.find()
            res.render('home', { pizzas: pizzas })
            // console.log(pizzas);
            Menu.find().then(function (pizzas) {
                // console.log(pizzas);
                return res.render('home', { pizzas: pizzas })
            })

        }
    }

}

module.exports = homeController