import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SummaryApi from '../common'
import displayDZDCurrency from '../helpers/displayCurrency'
import moment from 'moment'
import { toast } from 'react-toastify'

const Orders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchOrders = async () => {
        try {
            const response = await fetch(SummaryApi.getUserOrders.url, {
                method: SummaryApi.getUserOrders.method,
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const responseData = await response.json()

            if (responseData.success) {
                setOrders(responseData.data || [])
            } else {
                toast.error(responseData.message || 'Erreur lors du chargement des commandes')
            }
        } catch (error) {
            console.error('Error fetching orders:', error)
            toast.error('Erreur de connexion')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const getStatusColor = (status) => {
        switch (status) {
            case 'DELIVERED':
                return 'bg-green-100 text-green-800'
            case 'SHIPPED':
                return 'bg-blue-100 text-blue-800'
            case 'PROCESSING':
                return 'bg-yellow-100 text-yellow-800'
            case 'CANCELLED':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    if (loading) {
        return (
            <div className='container mx-auto p-4'>
                <div className='text-center'>Chargement...</div>
            </div>
        )
    }

    return (
        <div className='container mx-auto p-4'>
            <h1 className='text-2xl font-bold mb-6'>Mes commandes</h1>

            {orders.length === 0 ? (
                <div className='bg-white rounded-lg shadow p-8 text-center'>
                    <p className='text-gray-600 mb-4'>Vous n'avez aucune commande</p>
                    <Link
                        to='/'
                        className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition inline-block'
                    >
                        Commencer à magasiner
                    </Link>
                </div>
            ) : (
                <div className='space-y-4'>
                    {orders.map((order) => (
                        <div key={order._id} className='bg-white rounded-lg shadow p-6'>
                            <div className='flex justify-between items-start mb-4'>
                                <div>
                                    <p className='font-semibold text-lg'>Commande #{order.orderNumber}</p>
                                    <p className='text-sm text-gray-600'>
                                        {moment(order.createdAt).format('LLL')}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                                    {order.orderStatus}
                                </span>
                            </div>

                            <div className='space-y-2 mb-4'>
                                {order.items.map((item, index) => (
                                    <div key={index} className='flex items-center gap-4'>
                                        <div className='flex-1'>
                                            <p className='font-medium'>{item.productName}</p>
                                            <p className='text-sm text-gray-600'>
                                                Quantité: {item.quantity}
                                            </p>
                                        </div>
                                        <p className='font-semibold'>
                                            {displayDZDCurrency(item.quantity * item.sellingPrice)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className='flex justify-between items-center border-t pt-4'>
                                <div>
                                    <p className='text-sm text-gray-600'>Méthode de paiement:</p>
                                    <p className='font-medium'>{order.paymentMethod}</p>
                                </div>
                                <div className='text-right'>
                                    <p className='text-sm text-gray-600'>Total:</p>
                                    <p className='text-xl font-bold text-green-600'>
                                        {displayDZDCurrency(order.totalAmount)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Orders

