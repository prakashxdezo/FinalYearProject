const { default: mongoose, mongo } = require("mongoose");

 const dealSchema = new mongoose.Schema({
   discount: {
     type: Number,
     required: true,
   },
   category: {
     type: String, 
     required: true,
   },
 });

 const Deal = mongoose.model("Deal", dealSchema);

 module.exports = Deal;