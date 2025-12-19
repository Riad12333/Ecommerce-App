const userModel = require("../../models/userModel")
const productModel = require("../../models/productModel")
const addToCartModel = require("../../models/cartProduct")

async function dashboardStats(req, res) {
    try {
        // Statistiques des utilisateurs
        const totalUsers = await userModel.countDocuments()
        const adminUsers = await userModel.countDocuments({ role: "ADMIN" })
        // Compter les utilisateurs non-admin (USER et GENERAL)
        const customerUsers = await userModel.countDocuments({ 
            role: { $in: ["USER", "GENERAL"] } 
        })

        // Statistiques des produits
        const totalProducts = await productModel.countDocuments()
        const productsByCategory = await productModel.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ])

        // Statistiques des paniers
        const totalCarts = await addToCartModel.countDocuments()
        const totalItemsInCarts = await addToCartModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalQuantity: { $sum: "$quantity" }
                }
            }
        ])

        // Produits récents (5 derniers)
        const recentProducts = await productModel.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("productName brandName category createdAt")

        // Utilisateurs récents (5 derniers)
        const recentUsers = await userModel.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("name email role createdAt")

        // Statistiques des prix
        const priceStats = await productModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalValue: { $sum: "$price" },
                    totalSellingValue: { $sum: "$sellingPrice" },
                    avgPrice: { $avg: "$price" },
                    avgSellingPrice: { $avg: "$sellingPrice" }
                }
            }
        ])

        res.json({
            message: "Dashboard Statistics",
            success: true,
            error: false,
            data: {
                users: {
                    total: totalUsers,
                    admin: adminUsers,
                    customer: customerUsers
                },
                products: {
                    total: totalProducts,
                    byCategory: productsByCategory
                },
                carts: {
                    total: totalCarts,
                    totalItems: totalItemsInCarts[0]?.totalQuantity || 0
                },
                priceStats: priceStats[0] || {
                    totalValue: 0,
                    totalSellingValue: 0,
                    avgPrice: 0,
                    avgSellingPrice: 0
                },
                recentProducts,
                recentUsers
            }
        })
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

module.exports = dashboardStats

