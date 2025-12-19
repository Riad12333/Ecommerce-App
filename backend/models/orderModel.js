const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
            required: true
        },
        productName: String,
        quantity: {
            type: Number,
            required: true
        },
        price: Number,
        sellingPrice: Number
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        name: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'ONLINE', 'CARD'],
        default: 'COD'
    },
    paymentStatus: {
        type: String,
        enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
        default: 'PENDING'
    },
    orderStatus: {
        type: String,
        enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
        default: 'PENDING'
    },
    orderNumber: {
        type: String,
        unique: true
    },
    transactionId: String,
    notes: String
}, {
    timestamps: true
})

// Générer un numéro de commande unique avant de sauvegarder
orderSchema.pre('save', async function(next) {
    if (!this.orderNumber) {
        try {
            const OrderModel = mongoose.model('order')
            const count = await OrderModel.countDocuments()
            this.orderNumber = `ORD${Date.now()}${String(count + 1).padStart(4, '0')}`
        } catch (err) {
            // Si le modèle n'existe pas encore, utiliser timestamp seulement
            this.orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`
        }
    }
    next()
})

const orderModel = mongoose.model('order', orderSchema)

module.exports = orderModel

