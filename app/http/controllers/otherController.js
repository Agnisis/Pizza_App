
// const other = require("../../models/other");

// function otherController() {
//   //factory functions pattern of programs
//   return {
//     async index(req, res) {
//       const others = await other.find();
//       res.render("others", { others: others });
    
//       other.find().then(function (pizzas) {
    
//         return res.render("/others", { others: others });
//       });
//     },
//   };
// }

// module.exports = otherController;

const other = require("../../models/other");

function otherController() {
  return {
    async index(req, res) {
      try {
        const others = await other.find();
        res.render("others", { others: others });
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    },
  };
}

module.exports = otherController;
