const orderModel = require('../../models/orderModel')
const addToCartModel = require('../../models/cartProduct')
const productModel = require('../../models/productModel')

async function createOrderController(req, res) {
    try {
        console.log('=== CREATE ORDER REQUEST ===')
        console.log('Body:', JSON.stringify(req.body, null, 2))
        console.log('UserId:', req.userId)
        
        const userId = req.userId
        const { shippingAddress, paymentMethod, notes } = req.body

        if (!userId) {
            console.log('ERROR: No userId')
            return res.status(401).json({
                message: "Vous devez être connecté pour passer une commande",
                error: true,
                success: false
            })
        }

        // Valider l'adresse de livraison
        if (!shippingAddress) {
            console.log('ERROR: shippingAddress is missing')
            return res.status(400).json({
                message: "Adresse de livraison requise",
                error: true,
                success: false
            })
        }

        const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'zipCode']
        const missingFields = requiredFields.filter(field => !shippingAddress[field] || shippingAddress[field].trim() === '')

        if (missingFields.length > 0) {
            console.log('ERROR: Missing fields:', missingFields)
            return res.status(400).json({
                message: `Champs manquants dans l'adresse: ${missingFields.join(', ')}`,
                error: true,
                success: false,
                missingFields
            })
        }

        // Récupérer le panier de l'utilisateur
        console.log('Fetching cart items for userId:', userId)
        const cartItems = await addToCartModel.find({ userId })
        console.log('Cart items found:', cartItems.length)

        if (!cartItems || cartItems.length === 0) {
            console.log('ERROR: Cart is empty')
            return res.status(400).json({
                message: "Votre panier est vide",
                error: true,
                success: false
            })
        }

        // Vérifier et enrichir les items avec les détails des produits
        const items = []
        let totalAmount = 0
        const invalidProductIds = []

        for (const cartItem of cartItems) {
            console.log('Processing cart item:', cartItem.productId)
            const product = await productModel.findById(cartItem.productId)
            console.log('Product found:', product ? 'Yes' : 'No')

            if (!product) {
                console.log('Product not found, will be removed from cart:', cartItem.productId)
                invalidProductIds.push(cartItem.productId)
                continue // Passer au produit suivant au lieu de retourner une erreur
            }

            const itemTotal = (product.sellingPrice || product.price) * cartItem.quantity
            totalAmount += itemTotal

            items.push({
                productId: cartItem.productId,
                productName: product.productName,
                quantity: cartItem.quantity,
                price: product.price,
                sellingPrice: product.sellingPrice || product.price
            })
        }

        // Nettoyer le panier des produits introuvables
        if (invalidProductIds.length > 0) {
            console.log('Removing invalid products from cart:', invalidProductIds)
            for (const invalidId of invalidProductIds) {
                await addToCartModel.deleteOne({ 
                    userId, 
                    productId: invalidId 
                })
            }
        }

        // Si aucun produit valide n'a été trouvé
        if (items.length === 0) {
            return res.status(400).json({
                message: "Tous les produits de votre panier ne sont plus disponibles",
                error: true,
                success: false
            })
        }

        // Créer la commande
        const order = new orderModel({
            userId,
            items,
            totalAmount,
            shippingAddress: {
                name: shippingAddress.name.trim(),
                email: shippingAddress.email.trim(),
                phone: shippingAddress.phone.trim(),
                address: shippingAddress.address.trim(),
                city: shippingAddress.city.trim(),
                state: shippingAddress.state.trim(),
                zipCode: shippingAddress.zipCode.trim(),
                country: shippingAddress.country?.trim() || 'India'
            },
            paymentMethod: paymentMethod || 'COD',
            paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
            notes: notes || ''
        })

        const savedOrder = await order.save()
        
        console.log('Order created successfully:', savedOrder.orderNumber)

        // Vider le panier après création de la commande
        await addToCartModel.deleteMany({ userId })

        res.status(201).json({
            message: "Commande créée avec succès",
            success: true,
            error: false,
            data: savedOrder
        })

    } catch (err) {
        console.error('=== ERROR CREATING ORDER ===')
        console.error('Error message:', err.message)
        console.error('Error stack:', err.stack)
        console.error('Full error:', err)
        res.status(400).json({
            message: err.message || "Erreur lors de la création de la commande",
            error: true,
            success: false
        })
    }
}

module.exports = createOrderController

