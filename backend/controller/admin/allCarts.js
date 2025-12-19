const addToCartModel = require("../../models/cartProduct")
const userModel = require("../../models/userModel")
const productModel = require("../../models/productModel")
const mongoose = require('mongoose')

async function allCartsController(req, res) {
    try {
        // Récupérer tous les paniers avec les détails des produits et utilisateurs
        const allCarts = await addToCartModel.find()
            .sort({ createdAt: -1 })

        // Grouper par utilisateur pour avoir une meilleure vue
        const cartsByUser = await addToCartModel.aggregate([
            {
                $group: {
                    _id: "$userId",
                    totalItems: { $sum: "$quantity" },
                    cartCount: { $sum: 1 },
                    items: {
                        $push: {
                            productId: "$productId",
                            quantity: "$quantity",
                            createdAt: "$createdAt"
                        }
                    }
                }
            }
        ])

        // Enrichir avec les informations utilisateur et produit
        const enrichedCarts = await Promise.all(
            cartsByUser.map(async (cart) => {
                try {
                    const user = await userModel.findById(cart._id).select("name email")
                    const enrichedItems = await Promise.all(
                        cart.items.map(async (item) => {
                            try {
                                // Convertir productId en ObjectId si c'est une string
                                let productId = item.productId
                                if (typeof productId === 'string') {
                                    productId = mongoose.Types.ObjectId.isValid(productId) 
                                        ? new mongoose.Types.ObjectId(productId)
                                        : null
                                }
                                
                                const product = productId ? await productModel.findById(productId) : null
                                return {
                                    ...item,
                                    product: product || null
                                }
                            } catch (itemError) {
                                console.error('Error fetching product:', itemError)
                                return {
                                    ...item,
                                    product: null
                                }
                            }
                        })
                    )
                    return {
                        userId: cart._id ? cart._id.toString() : null,
                        user: user || null,
                        totalItems: cart.totalItems,
                        cartCount: cart.cartCount,
                        items: enrichedItems
                    }
                } catch (userError) {
                    console.error('Error fetching user:', userError)
                    return {
                        userId: cart._id ? cart._id.toString() : null,
                        user: null,
                        totalItems: cart.totalItems,
                        cartCount: cart.cartCount,
                        items: cart.items.map(item => ({
                            ...item,
                            product: null
                        }))
                    }
                }
            })
        )

        res.json({
            message: "All Carts",
            success: true,
            error: false,
            data: {
                allCarts: allCarts || [],
                cartsByUser: enrichedCarts || [],
                totalCarts: allCarts ? allCarts.length : 0
            }
        })
    } catch (err) {
        console.error('Error in allCartsController:', err)
        res.status(400).json({
            message: err.message || "Erreur lors de la récupération des paniers",
            error: true,
            success: false
        })
    }
}

module.exports = allCartsController

