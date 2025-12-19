import SummaryApi from "../common"
import { toast } from 'react-toastify'

const addToCart = async(e,id) =>{
    e?.stopPropagation()
    e?.preventDefault()

    try {
        const response = await fetch(SummaryApi.addToCartProduct.url,{
            method : SummaryApi.addToCartProduct.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
            body : JSON.stringify(
                { productId : id }
            )
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const responseData = await response.json()

        if(responseData.success){
            toast.success(responseData.message)
        }

        if(responseData.error){
            toast.error(responseData.message)
        }

        return responseData
    } catch (error) {
        console.error('Error adding to cart:', error.message)
        toast.error('Erreur lors de l\'ajout au panier. Assurez-vous que le serveur backend est démarré.')
        return { success: false, error: true, message: error.message }
    }
}


export default addToCart
