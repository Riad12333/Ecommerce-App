const productModel = require("../../models/productModel")
const addToCartModel = require("../../models/cartProduct")

async function deleteProductController(req, res) {
    try {
        const { productId } = req.body

        if (!productId) {
            return res.status(400).json({
                message: "Product ID is required",
                error: true,
                success: false
            })
        }

        // Supprimer le produit
        const deletedProduct = await productModel.findByIdAndDelete(productId)

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            })
        }

        // Supprimer aussi le produit des paniers des utilisateurs
        await addToCartModel.deleteMany({ productId: productId })

        res.json({
            message: "Product deleted successfully",
            success: true,
            error: false,
            data: deletedProduct
        })
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

module.exports = deleteProductController

