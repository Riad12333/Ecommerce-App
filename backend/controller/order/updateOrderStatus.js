const orderModel = require('../../models/orderModel')

async function updateOrderStatusController(req, res) {
    try {
        const { orderId, orderStatus, paymentStatus } = req.body

        if (!orderId) {
            return res.status(400).json({
                message: "ID de commande requis",
                error: true,
                success: false
            })
        }

        const updateData = {}
        if (orderStatus) {
            updateData.orderStatus = orderStatus
        }
        if (paymentStatus) {
            updateData.paymentStatus = paymentStatus
        }

        const order = await orderModel.findByIdAndUpdate(
            orderId,
            updateData,
            { new: true }
        ).populate('items.productId')

        if (!order) {
            return res.status(404).json({
                message: "Commande non trouvée",
                error: true,
                success: false
            })
        }

        res.json({
            message: "Statut de commande mis à jour",
            success: true,
            error: false,
            data: order
        })

    } catch (err) {
        res.status(400).json({
            message: err.message || "Erreur lors de la mise à jour du statut",
            error: true,
            success: false
        })
    }
}

module.exports = updateOrderStatusController

