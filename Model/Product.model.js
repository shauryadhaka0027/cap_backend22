const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
   products:{type:Array,unique:true},
   Id:{type:"string",unique:true},
   image:{type:"string",unique:true}
});
const ProductModel = mongoose.model('products', productSchema);

module.exports = {ProductModel};
