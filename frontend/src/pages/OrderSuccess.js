import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import SummaryApi from '../common'
import displayDZDCurrency from '../helpers/displayCurrency'
import moment from 'moment'
import { FaCheckCircle } from 'react-icons/fa'

const OrderSuccess = () => {
    const { orderId } = useParams()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`${SummaryApi.getUserOrders.url}`, {
                    method: SummaryApi.getUserOrders.method,
                    credentials: 'include'
                })

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const responseData = await response.json()

                if (responseData.success) {
                    const foundOrder = responseData.data.find(o => o._id === orderId)
                    if (foundOrder) {
                        setOrder(foundOrder)
                    }
                }
            } catch (error) {
                console.error('Error fetching order:', error)
            } finally {
                setLoading(false)
            }
        }

        if (orderId) {
            fetchOrder()
        }
    }, [orderId])

    if (loading) {
        return (
            <div className='container mx-auto p-4 text-center'>
                <div>Chargement...</div>
            </div>
        )
    }

    if (!order) {
        return (
            <div className='container mx-auto p-4 text-center'>
                <div className='text-red-600 mb-4'>Commande non trouvée</div>
                <Link to='/' className='text-blue-600 underline'>Retour à l'accueil</Link>
            </div>
        )
    }

    return (
        <div className='container mx-auto p-4 max-w-4xl'>
            <div className='bg-white rounded-lg shadow-lg p-8 text-center'>
                <FaCheckCircle className='text-green-500 text-6xl mx-auto mb-4' />
                <h1 className='text-3xl font-bold text-green-600 mb-2'>Commande confirmée!</h1>
                <p className='text-gray-600 mb-6'>Merci pour votre achat</p>

                <div className='bg-gray-50 rounded-lg p-6 mb-6 text-left'>
                    <h2 className='text-xl font-semibold mb-4'>Détails de la commande</h2>
                    <div className='space-y-2'>
                        <div className='flex justify-between'>
                            <span className='font-medium'>Numéro de commande:</span>
                            <span className='text-blue-600 font-bold'>{order.orderNumber}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='font-medium'>Date:</span>
                            <span>{moment(order.createdAt).format('LLL')}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='font-medium'>Statut:</span>
                            <span className='px-3 py-1 bg-yellow-100 text-yellow-800 rounded'>
                                {order.orderStatus}
                            </span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='font-medium'>Montant total:</span>
                            <span className='text-xl font-bold text-green-600'>
                                {displayDZDCurrency(order.totalAmount)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className='bg-gray-50 rounded-lg p-6 mb-6 text-left'>
                    <h2 className='text-xl font-semibold mb-4'>Articles commandés</h2>
                    <div className='space-y-3'>
                        {order.items.map((item, index) => (
                            <div key={index} className='flex items-center gap-4 border-b pb-3'>
                                <div className='flex-1'>
                                    <p className='font-medium'>{item.productName}</p>
                                    <p className='text-sm text-gray-600'>
                                        Quantité: {item.quantity} × {displayDZDCurrency(item.sellingPrice)}
                                    </p>
                                </div>
                                <p className='font-semibold'>
                                    {displayDZDCurrency(item.quantity * item.sellingPrice)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='flex gap-4 justify-center'>
                    <Link
                        to='/orders'
                        className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition'
                    >
                        Voir mes commandes
                    </Link>
                    <Link
                        to='/'
                        className='bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition'
                    >
                        Continuer les achats
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default OrderSuccess

