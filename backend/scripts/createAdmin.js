require('dotenv').config()
const mongoose = require('mongoose')
const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs')

async function createAdmin() {
    try {
        // Connexion à MongoDB
        if (!process.env.MONGODB_URI) {
            console.error("[DB] MONGODB_URI manquant dans .env")
            throw new Error("Missing MONGODB_URI")
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 20000,
        })

        const dbName = mongoose.connection.db.databaseName
        const collectionName = userModel.collection.name
        console.log(`[DB] Connecté à MongoDB`)
        console.log(`[DB] Base de données: ${dbName}`)
        console.log(`[DB] Collection: ${collectionName}`)

        // Informations de l'admin
        const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com"
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123"
        const adminName = process.env.ADMIN_NAME || "Admin"

        // Vérifier si l'admin existe déjà
        const existingAdmin = await userModel.findOne({ email: adminEmail })

        if (existingAdmin) {
            // Mettre à jour le rôle si l'utilisateur existe
            existingAdmin.role = "ADMIN"
            await existingAdmin.save()
            console.log(`[ADMIN] ✅ Utilisateur ${adminEmail} mis à jour en ADMIN`)
        } else {
            // Créer un nouvel admin
            const hashedPassword = await bcrypt.hash(adminPassword, 10)
            
            const admin = new userModel({
                name: adminName,
                email: adminEmail,
                password: hashedPassword,
                role: "ADMIN",
                profilePic: ""
            })

            const savedAdmin = await admin.save()
            console.log(`[ADMIN] ✅ Nouvel admin créé avec succès!`)
            console.log(`[ADMIN] Email: ${adminEmail}`)
            console.log(`[ADMIN] Password: ${adminPassword}`)
            console.log(`[ADMIN] ID: ${savedAdmin._id}`)
            
            // Vérification immédiate après sauvegarde
            const verifyAdmin = await userModel.findById(savedAdmin._id)
            if (verifyAdmin) {
                console.log(`[ADMIN] ✅ Vérification: Admin trouvé dans la base de données`)
                console.log(`[ADMIN] ✅ Nom: ${verifyAdmin.name}`)
                console.log(`[ADMIN] ✅ Email: ${verifyAdmin.email}`)
                console.log(`[ADMIN] ✅ Rôle: ${verifyAdmin.role}`)
            } else {
                console.error(`[ADMIN] ❌ ERREUR: Admin non trouvé après sauvegarde!`)
            }
        }

        // Afficher tous les admins
        const allAdmins = await userModel.find({ role: "ADMIN" })
        console.log(`\n[ADMIN] Total admins: ${allAdmins.length}`)
        allAdmins.forEach(admin => {
            console.log(`  - ${admin.name} (${admin.email}) - ID: ${admin._id}`)
        })

        // Afficher tous les utilisateurs pour vérification
        const allUsers = await userModel.find()
        const collectionCount = await mongoose.connection.db.collection(collectionName).countDocuments()
        console.log(`\n[INFO] Total documents dans la collection "${collectionName}": ${collectionCount}`)
        console.log(`[INFO] Total utilisateurs trouvés par modèle: ${allUsers.length}`)
        
        if (allUsers.length !== collectionCount) {
            console.warn(`[WARNING] ⚠️  Différence entre countDocuments() et find().length`)
            console.warn(`[WARNING] Cela peut indiquer un problème de synchronisation`)
        }
        
        allUsers.forEach((user, index) => {
            console.log(`  ${index + 1}. ${user.name} (${user.email}) - Rôle: ${user.role} - ID: ${user._id}`)
        })

        console.log("\n[ADMIN] ✅ Terminé!")
        
    } catch (error) {
        console.error("[ADMIN] ❌ Erreur:", error.message)
        process.exit(1)
    } finally {
        await mongoose.connection.close()
        console.log("[DB] Connexion fermée")
        process.exit(0)
    }
}

createAdmin()

