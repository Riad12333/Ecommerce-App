import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import moment from 'moment'
import displayDZDCurrency from '../helpers/displayCurrency'

const AllCarts = () => {
    const [cartsData, setCartsData] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchAllCarts = async () => {
        try {
            const response = await fetch(SummaryApi.allCarts.url, {
                method: SummaryApi.allCarts.method,
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const dataResponse = await response.json()

            if (dataResponse.success) {
                setCartsData(dataResponse.data)
            } else {
                console.error('AllCarts error:', dataResponse)
                toast.error(dataResponse.message || 'Erreur lors du chargement des paniers')
                if (dataResponse.message && (dataResponse.message.includes('non autorisé') || dataResponse.message.includes('refusé') || dataResponse.message.includes('Login'))) {
                    setTimeout(() => {
                        window.location.href = '/'
                    }, 2000)
                }
            }
        } catch (error) {
            console.error('Error fetching all carts:', error)
            toast.error('Erreur de connexion. Vérifiez que le serveur backend est démarré.')
            setCartsData(null) // S'assurer que cartsData est null pour afficher le message d'erreur
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAllCarts()
    }, [])

    if (loading) {
        return (
            <div className='flex justify-center items-center h-[calc(100vh-120px)]'>
                <div className='text-xl'>Chargement...</div>
            </div>
        )
    }

    if (!cartsData) {
        return (
            <div className='flex justify-center items-center h-[calc(100vh-120px)]'>
                <div className='text-xl text-red-600'>Erreur de chargement des données</div>
            </div>
        )
    }

    return (
        <div className='bg-white pb-4'>
            <div className='bg-white py-2 px-4 flex justify-between items-center mb-4'>
                <h2 className='font-bold text-lg'>Tous les Paniers ({cartsData.totalCarts})</h2>
                <button
                    className='border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all py-1 px-3 rounded-full'
                    onClick={fetchAllCarts}
                >
                    Actualiser
                </button>
            </div>

            {cartsData.cartsByUser.length === 0 ? (
                <div className='text-center py-8'>
                    <p className='text-gray-500 text-lg'>Aucun panier trouvé</p>
                </div>
            ) : (
                <div className='space-y-6'>
                    {cartsData.cartsByUser.map((userCart, index) => (
                        <div key={index} className='border rounded-lg p-4 bg-gray-50'>
                            <div className='flex justify-between items-center mb-4 pb-3 border-b'>
                                <div>
                                    <h3 className='font-bold text-lg'>
                                        {userCart.user?.name || 'Utilisateur supprimé'}
                                    </h3>
                                    <p className='text-sm text-gray-600'>
                                        {userCart.user?.email || 'Email non disponible'}
                                    </p>
                                </div>
                                <div className='text-right'>
                                    <p className='text-sm text-gray-600'>Total articles</p>
                                    <p className='text-xl font-bold text-blue-600'>
                                        {userCart.totalItems}
                                    </p>
                                    <p className='text-xs text-gray-500'>
                                        {userCart.cartCount} article(s) unique(s)
                                    </p>
                                </div>
                            </div>

                            <div className='space-y-2'>
                                {userCart.items.map((item, itemIndex) => (
                                    item.product ? (
                                        <div
                                            key={itemIndex}
                                            className='bg-white p-3 rounded border flex items-center gap-4'
                                        >
                                            <div className='w-20 h-20 flex-shrink-0'>
                                                <img
                                                    src={item.product.productImage?.[0]}
                                                    alt={item.product.productName}
                                                    className='w-full h-full object-contain'
                                                />
                                            </div>
                                            <div className='flex-1'>
                                                <h4 className='font-semibold'>{item.product.productName}</h4>
                                                <p className='text-sm text-gray-600'>
                                                    {item.product.brandName} • {item.product.category}
                                                </p>
                                                <div className='flex items-center gap-4 mt-2'>
                                                    <span className='text-sm text-gray-600'>
                                                        Quantité: <strong>{item.quantity}</strong>
                                                    </span>
                                                    <span className='text-sm font-semibold text-green-600'>
                                                        {displayDZDCurrency(item.product.sellingPrice * item.quantity)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            key={itemIndex}
                                            className='bg-gray-100 p-3 rounded border text-sm text-gray-500'
                                        >
                                            Produit supprimé (ID: {item.productId})
                                        </div>
                                    )
                                ))}
                            </div>

                            <div className='mt-3 pt-3 border-t text-sm text-gray-500'>
                                Ajouté le: {moment(userCart.items[0]?.createdAt).format('LLL')}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default AllCarts

