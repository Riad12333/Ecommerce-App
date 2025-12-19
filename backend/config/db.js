const mongoose = require("mongoose")

async function connectDB(){
    try{
        if(!process.env.MONGODB_URI){
            console.error("[DB] MONGODB_URI manquant dans .env")
            throw new Error("Missing MONGODB_URI")
        }

        // Options explicites pour éviter les timeouts silencieux et améliorer la visibilité
        await mongoose.connect(process.env.MONGODB_URI,{
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 20000,
        })

        console.log("[DB] Connecté à MongoDB")
    }catch(err){
        console.error("[DB] Échec de connexion MongoDB:", err?.message || err)
        throw err
    }
}

module.exports = connectDB