const orderModel = require('../../models/orderModel')
const userModel = require('../../models/userModel')

async function allOrdersController(req, res) {
    try {
        // Récupérer toutes les commandes avec les détails des utilisateurs
        const orders = await orderModel.find()
            .sort({ createdAt: -1 })
            .populate('items.productId')

        // Enrichir avec les informations utilisateur
        const enrichedOrders = await Promise.all(
            orders.map(async (order) => {
                const user = await userModel.findById(order.userId).select('name email')
                return {
                    ...order.toObject(),
                    user: user || null
                }
            })
        )

        // Statistiques
        const totalOrders = orders.length
        const totalRevenue = orders.reduce((sum, order) => {
            if (order.paymentStatus === 'PAID') {
                return sum + (order.totalAmount || 0)
            }
            return sum
        }, 0)

        const pendingOrders = orders.filter(o => o.orderStatus === 'PENDING').length
        const processingOrders = orders.filter(o => o.orderStatus === 'PROCESSING').length
        const shippedOrders = orders.filter(o => o.orderStatus === 'SHIPPED').length
        const deliveredOrders = orders.filter(o => o.orderStatus === 'DELIVERED').length

        res.json({
            message: "Toutes les commandes",
            success: true,
            error: false,
            data: {
                orders: enrichedOrders,
                stats: {
                    total: totalOrders,
                    totalRevenue,
                    pending: pendingOrders,
                    processing: processingOrders,
                    shipped: shippedOrders,
                    delivered: deliveredOrders
                }
            }
        })

    } catch (err) {
        console.error('Error fetching all orders:', err)
        res.status(400).json({
            message: err.message || "Erreur lors de la récupération des commandes",
            error: true,
            success: false
        })
    }
}

module.exports = allOrdersController

