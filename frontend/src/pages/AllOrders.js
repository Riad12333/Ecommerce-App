import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import moment from 'moment'
import displayDZDCurrency from '../helpers/displayCurrency'

const AllOrders = () => {
    const [ordersData, setOrdersData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState({})

    const fetchAllOrders = async () => {
        try {
            const response = await fetch(SummaryApi.allOrders.url, {
                method: SummaryApi.allOrders.method,
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const dataResponse = await response.json()

            if (dataResponse.success) {
                setOrdersData(dataResponse.data)
            } else {
                console.error('AllOrders error:', dataResponse)
                toast.error(dataResponse.message || 'Erreur lors du chargement des commandes')
            }
        } catch (error) {
            console.error('Error fetching all orders:', error)
            toast.error('Erreur de connexion. Vérifiez que le serveur backend est démarré.')
            setOrdersData(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAllOrders()
    }, [])

    const handleUpdateStatus = async (orderId, orderStatus, paymentStatus) => {
        setUpdating(prev => ({ ...prev, [orderId]: true }))
        try {
            const response = await fetch(SummaryApi.updateOrderStatus.url, {
                method: SummaryApi.updateOrderStatus.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    orderId,
                    orderStatus: orderStatus || undefined,
                    paymentStatus: paymentStatus || undefined
                })
            })

            const dataResponse = await response.json()

            if (dataResponse.success) {
                toast.success('Statut mis à jour avec succès')
                fetchAllOrders()
            } else {
                toast.error(dataResponse.message || 'Erreur lors de la mise à jour')
            }
        } catch (error) {
            console.error('Error updating order status:', error)
            toast.error('Erreur lors de la mise à jour')
        } finally {
            setUpdating(prev => ({ ...prev, [orderId]: false }))
        }
    }

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
            case 'PAID':
                return 'bg-green-100 text-green-800'
            case 'FAILED':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    if (loading) {
        return (
            <div className='flex justify-center items-center h-[calc(100vh-120px)]'>
                <div className='text-xl'>Chargement...</div>
            </div>
        )
    }

    if (!ordersData) {
        return (
            <div className='flex justify-center items-center h-[calc(100vh-120px)]'>
                <div className='text-xl text-red-600'>Erreur de chargement des données</div>
            </div>
        )
    }

    const { orders, stats } = ordersData

    return (
        <div className='p-4 space-y-6'>
            <div className='bg-white py-2 px-4 flex justify-between items-center'>
                <h2 className='font-bold text-lg'>Toutes les commandes ({stats.total})</h2>
                <button
                    className='border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all py-1 px-3 rounded-full'
                    onClick={fetchAllOrders}
                >
                    Actualiser
                </button>
            </div>

            {/* Statistiques */}
            <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
                <div className='bg-white p-4 rounded shadow'>
                    <p className='text-sm text-gray-600'>Total Commandes</p>
                    <p className='text-2xl font-bold'>{stats.total}</p>
                </div>
                <div className='bg-white p-4 rounded shadow'>
                    <p className='text-sm text-gray-600'>En attente</p>
                    <p className='text-2xl font-bold text-yellow-600'>{stats.pending}</p>
                </div>
                <div className='bg-white p-4 rounded shadow'>
                    <p className='text-sm text-gray-600'>En traitement</p>
                    <p className='text-2xl font-bold text-blue-600'>{stats.processing}</p>
                </div>
                <div className='bg-white p-4 rounded shadow'>
                    <p className='text-sm text-gray-600'>Expédiées</p>
                    <p className='text-2xl font-bold text-purple-600'>{stats.shipped}</p>
                </div>
                <div className='bg-white p-4 rounded shadow'>
                    <p className='text-sm text-gray-600'>Revenus</p>
                    <p className='text-2xl font-bold text-green-600'>
                        {displayDZDCurrency(stats.totalRevenue)}
                    </p>
                </div>
            </div>

            {/* Liste des commandes */}
            {orders.length === 0 ? (
                <div className='text-center py-8'>
                    <p className='text-gray-500 text-lg'>Aucune commande trouvée</p>
                </div>
            ) : (
                <div className='space-y-4'>
                    {orders.map((order) => (
                        <div key={order._id} className='bg-white rounded-lg shadow p-6'>
                            <div className='flex justify-between items-start mb-4'>
                                <div className='flex-1'>
                                    <div className='flex items-center gap-4 mb-2'>
                                        <p className='font-semibold text-lg'>
                                            Commande #{order.orderNumber}
                                        </p>
                                        <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                                            {order.orderStatus}
                                        </span>
                                        <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(order.paymentStatus)}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                    <p className='text-sm text-gray-600'>
                                        Client: {order.user?.name || 'Utilisateur supprimé'} ({order.user?.email || 'N/A'})
                                    </p>
                                    <p className='text-sm text-gray-600'>
                                        Date: {moment(order.createdAt).format('LLL')}
                                    </p>
                                </div>
                                <div className='text-right'>
                                    <p className='text-xl font-bold text-green-600'>
                                        {displayDZDCurrency(order.totalAmount)}
                                    </p>
                                </div>
                            </div>

                            <div className='border-t pt-4 mb-4'>
                                <h3 className='font-semibold mb-2'>Articles:</h3>
                                <div className='space-y-2'>
                                    {order.items.map((item, index) => (
                                        <div key={index} className='flex items-center gap-4 text-sm'>
                                            <div className='flex-1'>
                                                <p className='font-medium'>{item.productName}</p>
                                                <p className='text-gray-600'>
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

                            <div className='border-t pt-4 flex gap-2'>
                                <select
                                    value={order.orderStatus}
                                    onChange={(e) => handleUpdateStatus(order._id, e.target.value, null)}
                                    disabled={updating[order._id]}
                                    className='border rounded px-3 py-1 text-sm'
                                >
                                    <option value='PENDING'>En attente</option>
                                    <option value='PROCESSING'>En traitement</option>
                                    <option value='SHIPPED'>Expédié</option>
                                    <option value='DELIVERED'>Livré</option>
                                    <option value='CANCELLED'>Annulé</option>
                                </select>
                                <select
                                    value={order.paymentStatus}
                                    onChange={(e) => handleUpdateStatus(order._id, null, e.target.value)}
                                    disabled={updating[order._id]}
                                    className='border rounded px-3 py-1 text-sm'
                                >
                                    <option value='PENDING'>En attente</option>
                                    <option value='PAID'>Payé</option>
                                    <option value='FAILED'>Échoué</option>
                                    <option value='REFUNDED'>Remboursé</option>
                                </select>
                                {updating[order._id] && (
                                    <span className='text-sm text-gray-500'>Mise à jour...</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default AllOrders

