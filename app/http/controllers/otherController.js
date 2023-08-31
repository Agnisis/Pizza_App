
const other = require("../../models/other");

function otherController() {
  //factory functions pattern of programs
  return {
    async index(req, res) {
      const others = await other.find();
      res.render("others", { others: others });
    
      other.find().then(function (pizzas) {
    
        return res.render("/others", { others: others });
      });
    },
  };
}

module.exports = otherController;
