const addToCartModel = require("../../models/cartProduct")
const mongoose = require('mongoose')

const addToCartController = async(req,res)=>{
    try{
        const { productId } = req?.body
        const currentUser = req.userId

        // Convertir productId en ObjectId si c'est une string
        let productObjectId = productId
        if (productId && !(productId instanceof mongoose.Types.ObjectId)) {
            if (mongoose.Types.ObjectId.isValid(productId)) {
                productObjectId = new mongoose.Types.ObjectId(productId)
            }
        }

        const isProductAvailable = await addToCartModel.findOne({ 
            productId: productObjectId,
            userId: currentUser 
        })

        console.log("isProductAvailable   ",isProductAvailable)

        if(isProductAvailable){
            return res.json({
                message : "Already exits in Add to cart",
                success : false,
                error : true
            })
        }

        const payload  = {
            productId : productObjectId,
            quantity : 1,
            userId : currentUser,
        }

        const newAddToCart = new addToCartModel(payload)
        const saveProduct = await newAddToCart.save()


        return res.json({
            data : saveProduct,
            message : "Product Added in Cart",
            success : true,
            error : false
        })
        

    }catch(err){
        res.json({
            message : err?.message || err,
            error : true,
            success : false
        })
    }
}


module.exports = addToCartController