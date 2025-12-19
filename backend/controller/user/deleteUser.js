const userModel = require("../../models/userModel")
const addToCartModel = require("../../models/cartProduct")

async function deleteUserController(req, res) {
    try {
        const { userId } = req.body
        const currentUserId = req.userId

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required",
                error: true,
                success: false
            })
        }

        // Empêcher l'admin de se supprimer lui-même
        if (userId === currentUserId) {
            return res.status(400).json({
                message: "You cannot delete your own account",
                error: true,
                success: false
            })
        }

        // Vérifier si l'utilisateur existe
        const userToDelete = await userModel.findById(userId)

        if (!userToDelete) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            })
        }

        // Supprimer l'utilisateur
        const deletedUser = await userModel.findByIdAndDelete(userId)

        // Supprimer aussi les paniers de cet utilisateur
        await addToCartModel.deleteMany({ userId: userId })

        res.json({
            message: "User deleted successfully",
            success: true,
            error: false,
            data: deletedUser
        })
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

module.exports = deleteUserController

