require('dotenv').config()
const mongoose = require('mongoose')
const productModel = require('../models/productModel')
const fs = require('fs')
const path = require('path')

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

// Fonction pour extraire le nom du produit du nom de fichier
function extractProductName(filename, category) {
    // Retirer l'extension
    let name = filename.replace(/\.(webp|jpg|jpeg|png)$/i, '')
    
    // Retirer les numéros à la fin (ex: " 1", " 2", etc.)
    name = name.replace(/\s+\d+\s*$/, '')
    name = name.replace(/\s+$/, '')
    
    // Retirer les numéros entre parenthèses ou à la fin
    name = name.replace(/\s*\(\d+\)\s*$/, '')
    
    return name.trim()
}

// Fonction pour extraire la marque du nom du produit
function extractBrand(productName) {
    const brands = ['boAt', 'Samsung', 'Apple', 'LG', 'Sony', 'Canon', 'Nikon', 'Logitech', 'HP', 'JBL', 'Philips', 'Syska', 'GoPro', 'Fujifilm', 'Imou', 'CP PLUS', 'PHILIPS', 'SJCAM']
    
    for (const brand of brands) {
        if (productName.toLowerCase().includes(brand.toLowerCase())) {
            return brand
        }
    }
    
    // Si aucune marque trouvée, prendre le premier mot
    const firstWord = productName.split(' ')[0]
    return firstWord || 'Unknown'
}

// Fonction pour scanner un dossier et grouper les images par produit
function scanCategory(categoryPath, categoryName) {
    const products = {}
    
    try {
        const files = fs.readdirSync(categoryPath)
        
        files.forEach(file => {
            // Ignorer les fichiers non-image
            if (!/\.(webp|jpg|jpeg|png)$/i.test(file)) {
                return
            }
            
            const productName = extractProductName(file, categoryName)
            
            if (!products[productName]) {
                products[productName] = []
            }
            
            // Chemin public pour les images (servi depuis public/)
            // Note: Les images devront être copiées dans public/assest/products/ pour être accessibles
            const imagePath = `/assest/products/${categoryName}/${file}`
            
            products[productName].push(imagePath)
        })
        
        // Trier les images par numéro (1, 2, 3, etc.)
        Object.keys(products).forEach(productName => {
            products[productName].sort((a, b) => {
                const aMatch = a.match(/(\d+)(\.(webp|jpg|jpeg|png))$/i)
                const bMatch = b.match(/(\d+)(\.(webp|jpg|jpeg|png))$/i)
                const aNum = aMatch ? parseInt(aMatch[1]) : 0
                const bNum = bMatch ? parseInt(bMatch[1]) : 0
                return aNum - bNum
            })
        })
        
    } catch (error) {
        console.error(`[SCAN] Erreur lors du scan de ${categoryName}:`, error.message)
    }
    
    return products
}

// Fonction pour générer un prix aléatoire réaliste
function generatePrice(category) {
    const priceRanges = {
        airpodes: { min: 999, max: 8999 },
        watches: { min: 1999, max: 49999 },
        mobiles: { min: 9999, max: 129999 },
        mouse: { min: 499, max: 8999 },
        televisions: { min: 19999, max: 199999 },
        camera: { min: 4999, max: 499999 },
        speakers: { min: 999, max: 19999 },
        earphones: { min: 299, max: 4999 },
        trimmers: { min: 499, max: 4999 },
        refrigerator: { min: 24999, max: 89999 },
        processor: { min: 9999, max: 89999 },
        printers: { min: 2999, max: 24999 }
    }
    
    const range = priceRanges[category] || { min: 999, max: 9999 }
    const price = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
    const sellingPrice = Math.floor(price * 0.85) // 15% de réduction
    
    return { price, sellingPrice }
}

// Fonction principale
async function seedProductsFromAssets() {
    try {
        await connectDB()
        
        // Chemin vers le dossier assest/products
        const assetsPath = path.join(__dirname, '../../frontend/src/assest/products')
        
        if (!fs.existsSync(assetsPath)) {
            console.error(`[SEED] Le dossier ${assetsPath} n'existe pas`)
            process.exit(1)
        }
        
        // Vérifier s'il y a déjà des produits
        const existingProducts = await productModel.countDocuments()
        
        if (existingProducts > 0) {
            console.log(`[SEED] ${existingProducts} produits existent déjà dans la base de données.`)
            console.log("[SEED] Suppression des anciens produits...")
            await productModel.deleteMany({})
            console.log("[SEED] Anciens produits supprimés.")
        }
        
        // Lire les catégories (dossiers)
        const categories = fs.readdirSync(assetsPath).filter(item => {
            const itemPath = path.join(assetsPath, item)
            return fs.statSync(itemPath).isDirectory()
        })
        
        console.log(`[SEED] ${categories.length} catégories trouvées:`, categories.join(', '))
        
        const allProducts = []
        
        // Mapper les noms de dossiers vers les noms de catégories normalisés
        const categoryMap = {
            'Mouse': 'mouse',
            'TV': 'televisions',
            'mobile': 'mobiles' // Le dossier est "mobile" mais la catégorie en DB doit être "mobiles"
        }
        
        // Scanner chaque catégorie
        categories.forEach(category => {
            const categoryPath = path.join(assetsPath, category)
            // Normaliser le nom de catégorie (en minuscules sauf pour les cas spéciaux)
            const normalizedCategory = categoryMap[category] || category.toLowerCase()
            const products = scanCategory(categoryPath, normalizedCategory)
            
            console.log(`\n[SEED] Catégorie "${category}" -> "${normalizedCategory}": ${Object.keys(products).length} produits trouvés`)
            
            // Créer un objet produit pour chaque produit trouvé
            Object.keys(products).forEach(productName => {
                if (products[productName].length === 0) return
                
                const brandName = extractBrand(productName)
                const { price, sellingPrice } = generatePrice(normalizedCategory)
                
                // Utiliser le nom de dossier original pour le chemin d'image, mais normalizedCategory pour la catégorie en DB
                const imagePaths = products[productName].map(imgPath => {
                    return imgPath.replace(`/${normalizedCategory}/`, `/${category}/`)
                })
                
                const product = {
                    productName: productName,
                    brandName: brandName,
                    category: normalizedCategory, // Catégorie normalisée pour la base de données
                    productImage: imagePaths, // Images avec le chemin original du dossier
                    description: `${productName} - Produit de qualité de la marque ${brandName}. Disponible dans la catégorie ${normalizedCategory}.`,
                    price: price,
                    sellingPrice: sellingPrice
                }
                
                allProducts.push(product)
            })
        })
        
        console.log(`\n[SEED] Insertion de ${allProducts.length} produits dans MongoDB...`)
        
        // Insérer par lots de 50 pour éviter les problèmes de mémoire
        const batchSize = 50
        let inserted = 0
        
        for (let i = 0; i < allProducts.length; i += batchSize) {
            const batch = allProducts.slice(i, i + batchSize)
            const result = await productModel.insertMany(batch)
            inserted += result.length
            console.log(`[SEED] ${inserted}/${allProducts.length} produits insérés...`)
        }
        
        console.log(`\n[SEED] ✅ ${inserted} produits insérés avec succès!`)
        
        // Afficher un résumé par catégorie
        const productsByCategory = await productModel.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ])
        
        console.log("\n[SEED] Résumé par catégorie:")
        productsByCategory.forEach(cat => {
            console.log(`  - ${cat._id}: ${cat.count} produits`)
        })
        
        console.log("\n[SEED] ✅ Initialisation terminée avec succès!")
        
    } catch (error) {
        console.error("[SEED] ❌ Erreur lors de l'initialisation:", error.message)
        console.error(error.stack)
        process.exit(1)
    } finally {
        await mongoose.connection.close()
        console.log("[DB] Connexion fermée")
        process.exit(0)
    }
}

// Exécuter le script
seedProductsFromAssets()

