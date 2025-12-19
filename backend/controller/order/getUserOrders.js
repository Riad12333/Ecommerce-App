const orderModel = require('../../models/orderModel')

async function getUserOrdersController(req, res) {
    try {
        const userId = req.userId

        if (!userId) {
            return res.status(401).json({
                message: "Vous devez être connecté",
                error: true,
                success: false
            })
        }

        const orders = await orderModel.find({ userId })
            .sort({ createdAt: -1 })
            .populate('items.productId')

        res.json({
            message: "Commandes récupérées avec succès",
            success: true,
            error: false,
            data: orders
        })

    } catch (err) {
        res.status(400).json({
            message: err.message || "Erreur lors de la récupération des commandes",
            error: true,
            success: false
        })
    }
}

module.exports = getUserOrdersController

