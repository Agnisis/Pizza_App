const Menu = require('../../models/menu')


function homeController() {

    //factory functions pattern of programs
    return {
        async index(req, res) {

            const pizzas = await Menu.find()
            res.render('home', { pizzas: pizzas })  
            Menu.find().then(function (pizzas) {
                return res.render('home', { pizzas: pizzas })
            })

        }
    }

}

module.exports = homeController