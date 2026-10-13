const productModel = require("../../models/productModel")

const getProductController = async(req,res)=>{
    try{
        const allProduct = await productModel.find().sort({ createdAt : -1 })
console.log("[PRODUCTS] Base :", productModel.db.name);
console.log("[PRODUCTS] Collection :", productModel.collection.name);
console.log("[PRODUCTS] Nombre trouvé :", allProduct.length);

        res.json({
            message : "All Product",
            success : true,
            error : false,
            data : allProduct
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }

}

module.exports = getProductController