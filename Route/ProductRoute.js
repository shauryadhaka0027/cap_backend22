const express= require('express');
const { ProductModel } = require('../Model/Product.model');
const productRouter=express.Router();


productRouter.post("/add",async(req,res)=>{
try {
    let data = new ProductModel(req.body)
    await data.save()
    res.send({"msg":"data is added"})
} catch (error) {
    res.send({"msg":error})
}
})

productRouter.get("/",async(req,res)=>{
    try {
        const data=await ProductModel.find();
        res.send({"msg":data})
    } catch (error) {
        res.send({"msg":error})
    }
})
  
productRouter.get("/search/:product_id", async (req, res) => {
    const { product_id } = req.params;
    try {
        const data = await ProductModel.findOne({Id: product_id });
        if (data) {
            res.send({ "msg": data });
        } else {
            res.status(404).send({ "msg": "Product not found" });
        }
    } catch (error) {
        res.status(500).send({ "msg": "Internal Server Error" });
    }
});
module.exports={productRouter}