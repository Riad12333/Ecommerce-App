const userModel = require("../models/userModel")

async function adminAuth(req, res, next) {
    try {
        const userId = req.userId

        if (!userId) {
            return res.status(401).json({
                message: "Non autorisé - Utilisateur non identifié",
                error: true,
                success: false
            })
        }

        const user = await userModel.findById(userId)

        if (!user) {
            return res.status(404).json({
                message: "Utilisateur non trouvé",
                error: true,
                success: false
            })
        }

        if (user.role !== "ADMIN") {
            return res.status(403).json({
                message: "Accès refusé - Droits administrateur requis",
                error: true,
                success: false
            })
        }

        // Ajouter les infos utilisateur à la requête pour utilisation ultérieure
        req.user = user
        next()

    } catch (err) {
        res.status(400).json({
            message: err.message || "Erreur lors de la vérification des permissions",
            error: true,
            success: false
        })
    }
}

module.exports = adminAuth

