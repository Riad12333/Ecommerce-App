require('dotenv').config()
const mongoose = require('mongoose')
const productModel = require('../models/productModel')

// Connexion à MongoDB
async function connectDB() {
    try {
        if (!process.env.MONGODB_URI) {
            console.error("[DB] MONGODB_URI manquant dans .env")
            throw new Error("Missing MONGODB_URI")
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 20000,
        })

        console.log("[DB] Connecté à MongoDB")
    } catch (err) {
        console.error("[DB] Échec de connexion MongoDB:", err?.message || err)
        throw err
    }
}

// Données de test - produits avec des images placeholder
const sampleProducts = [
    {
        productName: "boAt Airdopes 131",
        brandName: "boAt",
        category: "airpodes",
        productImage: [
            "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400",
            "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400"
        ],
        description: "Écouteurs sans fil Bluetooth avec autonomie longue durée",
        price: 2999,
        sellingPrice: 1999
    },
    {
        productName: "boAt Airdopes 381",
        brandName: "boAt",
        category: "airpodes",
        productImage: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"
        ],
        description: "Écouteurs sans fil avec annulation de bruit",
        price: 4999,
        sellingPrice: 3499
    },
    {
        productName: "Samsung Galaxy Watch",
        brandName: "Samsung",
        category: "watches",
        productImage: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"
        ],
        description: "Montre intelligente avec suivi de la condition physique",
        price: 24999,
        sellingPrice: 19999
    },
    {
        productName: "Apple Watch Series",
        brandName: "Apple",
        category: "watches",
        productImage: [
            "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400",
            "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400"
        ],
        description: "Montre connectée Apple avec écran Retina",
        price: 39999,
        sellingPrice: 34999
    },
    {
        productName: "Samsung Galaxy S21",
        brandName: "Samsung",
        category: "mobiles",
        productImage: [
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"
        ],
        description: "Smartphone Android haut de gamme",
        price: 79999,
        sellingPrice: 69999
    },
    {
        productName: "iPhone 13 Pro",
        brandName: "Apple",
        category: "mobiles",
        productImage: [
            "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
            "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400"
        ],
        description: "iPhone avec caméra triple et puce A15 Bionic",
        price: 119999,
        sellingPrice: 109999
    },
    {
        productName: "Logitech MX Master 3",
        brandName: "Logitech",
        category: "mouse",
        productImage: [
            "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400",
            "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400"
        ],
        description: "Souris sans fil ergonomique pour productivité",
        price: 8999,
        sellingPrice: 7499
    },
    {
        productName: "Sony 55\" 4K Smart TV",
        brandName: "Sony",
        category: "televisions",
        productImage: [
            "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
            "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400"
        ],
        description: "Téléviseur LED 4K Ultra HD avec Android TV",
        price: 89999,
        sellingPrice: 79999
    },
    {
        productName: "LG 65\" OLED TV",
        brandName: "LG",
        category: "televisions",
        productImage: [
            "https://images.unsplash.com/photo-1467297422092-1490cdf7c2b8?w=400",
            "https://images.unsplash.com/photo-1467297422092-1490cdf7c2b8?w=400"
        ],
        description: "Téléviseur OLED 4K avec HDR et Smart TV",
        price: 199999,
        sellingPrice: 179999
    },
    {
        productName: "Canon EOS R5",
        brandName: "Canon",
        category: "camera",
        productImage: [
            "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400",
            "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400"
        ],
        description: "Appareil photo sans miroir full-frame 45MP",
        price: 449999,
        sellingPrice: 399999
    },
    {
        productName: "JBL Flip 5",
        brandName: "JBL",
        category: "speakers",
        productImage: [
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400"
        ],
        description: "Enceinte Bluetooth portable étanche",
        price: 8999,
        sellingPrice: 7499
    },
    {
        productName: "Sony WH-1000XM4",
        brandName: "Sony",
        category: "earphones",
        productImage: [
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400"
        ],
        description: "Casque sans fil avec annulation de bruit active",
        price: 34999,
        sellingPrice: 29999
    },
    {
        productName: "Philips BT3231/15",
        brandName: "Philips",
        category: "trimmers",
        productImage: [
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400",
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400"
        ],
        description: "Tondeuse à barbe rechargeable",
        price: 2499,
        sellingPrice: 1999
    },
    {
        productName: "LG 452L Refrigerator",
        brandName: "LG",
        category: "refrigerator",
        productImage: [
            "https://images.unsplash.com/photo-1571171637578-5bc51f7a3d7c?w=400",
            "https://images.unsplash.com/photo-1571171637578-5bc51f7a3d7c?w=400"
        ],
        description: "Réfrigérateur double porte avec technologie Inverter",
        price: 54999,
        sellingPrice: 49999
    },
    {
        productName: "Intel Core i9-12900K",
        brandName: "Intel",
        category: "processor",
        productImage: [
            "https://images.unsplash.com/photo-1591488320449-011701770398?w=400",
            "https://images.unsplash.com/photo-1591488320449-011701770398?w=400"
        ],
        description: "Processeur de bureau 12ème génération",
        price: 59999,
        sellingPrice: 54999
    },
    {
        productName: "HP LaserJet Pro",
        brandName: "HP",
        category: "printers",
        productImage: [
            "https://images.unsplash.com/photo-1614699897394-94a5ba4d1f32?w=400",
            "https://images.unsplash.com/photo-1614699897394-94a5ba4d1f32?w=400"
        ],
        description: "Imprimante laser monochrome rapide",
        price: 24999,
        sellingPrice: 21999
    }
]

// Fonction principale pour initialiser les données
async function seedProducts() {
    try {
        await connectDB()

        // Vérifier s'il y a déjà des produits
        const existingProducts = await productModel.countDocuments()
        
        if (existingProducts > 0) {
            console.log(`[SEED] ${existingProducts} produits existent déjà dans la base de données.`)
            console.log("[SEED] Suppression des anciens produits...")
            await productModel.deleteMany({})
            console.log("[SEED] Anciens produits supprimés.")
        }

        // Insérer les produits de test
        console.log("[SEED] Insertion des produits de test...")
        const insertedProducts = await productModel.insertMany(sampleProducts)
        console.log(`[SEED] ✅ ${insertedProducts.length} produits insérés avec succès!`)

        // Afficher un résumé par catégorie
        const productsByCategory = await productModel.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ])

        console.log("\n[SEED] Résumé par catégorie:")
        productsByCategory.forEach(cat => {
            console.log(`  - ${cat._id}: ${cat.count} produits`)
        })

        console.log("\n[SEED] ✅ Initialisation terminée avec succès!")
        
    } catch (error) {
        console.error("[SEED] ❌ Erreur lors de l'initialisation:", error.message)
        process.exit(1)
    } finally {
        await mongoose.connection.close()
        console.log("[DB] Connexion fermée")
        process.exit(0)
    }
}

// Exécuter le script
seedProducts()

