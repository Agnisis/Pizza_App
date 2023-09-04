// const Menu = require('../../models/menu')


// function homeController() {

//     //factory functions pattern of programs
//     return {
//         async index(req, res) {

//             const pizzas = await Menu.find()
//             res.render('home', { pizzas: pizzas })  
//             Menu.find().then(function (pizzas) {
//                 return res.render('home', { pizzas: pizzas })
//             })

//         }
//     }

// }

// module.exports = homeController



const Menu = require("../../models/menu");

function homeController() {
  return {
    async index(req, res) {
      try {
        const pizzas = await Menu.find();
        res.render("home", { pizzas: pizzas });
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    },
  };
}

module.exports = homeController;
