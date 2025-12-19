require('dotenv').config()
const mongoose = require('mongoose')
const userModel = require('../models/userModel')

async function listUsers() {
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
        console.log(`[DB] Connecté à MongoDB`)
        console.log(`[DB] Base de données: ${dbName}\n`)

        // Lister tous les utilisateurs
        const allUsers = await userModel.find().sort({ createdAt: -1 })
        
        console.log(`========================================`)
        console.log(`Total utilisateurs: ${allUsers.length}`)
        console.log(`========================================\n`)

        if (allUsers.length === 0) {
            console.log("Aucun utilisateur trouvé dans la base de données.")
        } else {
            allUsers.forEach((user, index) => {
                console.log(`${index + 1}. ${user.name}`)
                console.log(`   Email: ${user.email}`)
                console.log(`   Rôle: ${user.role}`)
                console.log(`   ID: ${user._id}`)
                console.log(`   Créé le: ${user.createdAt}`)
                console.log(`   ---`)
            })

            // Statistiques par rôle
            const admins = allUsers.filter(u => u.role === "ADMIN")
            const generals = allUsers.filter(u => u.role === "GENERAL")
            const users = allUsers.filter(u => u.role === "USER")

            console.log(`\n📊 Statistiques:`)
            console.log(`   Admins: ${admins.length}`)
            console.log(`   Generals: ${generals.length}`)
            console.log(`   Users: ${users.length}`)
        }

    } catch (error) {
        console.error("[ERROR] ❌ Erreur:", error.message)
        process.exit(1)
    } finally {
        await mongoose.connection.close()
        console.log("\n[DB] Connexion fermée")
        process.exit(0)
    }
}

listUsers()

