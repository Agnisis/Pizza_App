const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otherSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, required: true },
  size: { type: String, required: true },
});
module.exports = mongoose.model("Other", otherSchema);
