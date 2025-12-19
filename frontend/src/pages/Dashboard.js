import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import { FaUsers, FaShoppingBag, FaShoppingCart, FaBox } from 'react-icons/fa'
import moment from 'moment'
import displayDZDCurrency from '../helpers/displayCurrency'

const Dashboard = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchDashboardStats = async () => {
        try {
            const response = await fetch(SummaryApi.dashboardStats.url, {
                method: SummaryApi.dashboardStats.method,
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const dataResponse = await response.json()

            if (dataResponse.success) {
                setStats(dataResponse.data)
            } else {
                console.error('Dashboard error:', dataResponse)
                toast.error(dataResponse.message || 'Erreur lors du chargement des statistiques')
                if (dataResponse.message && (dataResponse.message.includes('non autorisé') || dataResponse.message.includes('refusé') || dataResponse.message.includes('Login'))) {
                    // Rediriger si l'utilisateur n'est pas admin ou non connecté
                    setTimeout(() => {
                        window.location.href = '/'
                    }, 2000)
                }
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error)
            toast.error('Erreur de connexion. Vérifiez que le serveur backend est démarré.')
            setStats(null) // S'assurer que stats est null pour afficher le message d'erreur
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardStats()
    }, [])

    if (loading) {
        return (
            <div className='flex justify-center items-center h-[calc(100vh-120px)]'>
                <div className='text-xl'>Chargement...</div>
            </div>
        )
    }

    if (!stats) {
        return (
            <div className='flex justify-center items-center h-[calc(100vh-120px)]'>
                <div className='text-xl text-red-600'>Erreur de chargement des données</div>
            </div>
        )
    }

    const StatCard = ({ icon, title, value, color = "blue" }) => {
        const colorClasses = {
            blue: "bg-blue-100 text-blue-600",
            green: "bg-green-100 text-green-600",
            purple: "bg-purple-100 text-purple-600",
            orange: "bg-orange-100 text-orange-600",
            red: "bg-red-100 text-red-600"
        }

        return (
            <div className='bg-white p-6 rounded-lg shadow-md'>
                <div className='flex items-center justify-between'>
                    <div>
                        <p className='text-gray-600 text-sm'>{title}</p>
                        <p className='text-3xl font-bold mt-2'>{value}</p>
                    </div>
                    <div className={`${colorClasses[color]} p-4 rounded-full`}>
                        {icon}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='p-4 space-y-6'>
            <h1 className='text-3xl font-bold mb-6'>Tableau de bord</h1>

            {/* Cartes de statistiques principales */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <StatCard
                    icon={<FaUsers className='text-2xl' />}
                    title="Total Utilisateurs"
                    value={stats.users.total}
                    color="blue"
                />
                <StatCard
                    icon={<FaShoppingBag className='text-2xl' />}
                    title="Total Produits"
                    value={stats.products.total}
                    color="green"
                />
                <StatCard
                    icon={<FaShoppingCart className='text-2xl' />}
                    title="Paniers Actifs"
                    value={stats.carts.total}
                    color="purple"
                />
                <StatCard
                    icon={<FaBox className='text-2xl' />}
                    title="Articles dans Paniers"
                    value={stats.carts.totalItems}
                    color="orange"
                />
            </div>

            {/* Détails des utilisateurs */}
            <div className='bg-white p-6 rounded-lg shadow-md'>
                <h2 className='text-xl font-bold mb-4'>Répartition des Utilisateurs</h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='text-center p-4 bg-blue-50 rounded'>
                        <p className='text-2xl font-bold text-blue-600'>{stats.users.total}</p>
                        <p className='text-gray-600'>Total</p>
                    </div>
                    <div className='text-center p-4 bg-green-50 rounded'>
                        <p className='text-2xl font-bold text-green-600'>{stats.users.admin}</p>
                        <p className='text-gray-600'>Admins</p>
                    </div>
                    <div className='text-center p-4 bg-orange-50 rounded'>
                        <p className='text-2xl font-bold text-orange-600'>{stats.users.customer}</p>
                        <p className='text-gray-600'>Clients</p>
                    </div>
                </div>
            </div>

            {/* Produits par catégorie */}
            <div className='bg-white p-6 rounded-lg shadow-md'>
                <h2 className='text-xl font-bold mb-4'>Produits par Catégorie</h2>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {stats.products.byCategory.map((cat, index) => (
                        <div key={index} className='p-4 bg-gray-50 rounded border'>
                            <p className='font-semibold capitalize'>{cat._id}</p>
                            <p className='text-2xl font-bold text-green-600'>{cat.count}</p>
                        </div>
                    ))}
                </div>
            </div>



            {/* Statistiques des prix */}
            <div className='bg-white p-6 rounded-lg shadow-md'>
                <h2 className='text-xl font-bold mb-4'>Statistiques des Prix</h2>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    <div className='text-center p-4 bg-gray-50 rounded'>
                        <p className='text-sm text-gray-600'>Prix Moyen</p>
                        <p className='text-xl font-bold'>{displayDZDCurrency(stats.priceStats.avgPrice)}</p>
                    </div>
                    <div className='text-center p-4 bg-gray-50 rounded'>
                        <p className='text-sm text-gray-600'>Prix de Vente Moyen</p>
                        <p className='text-xl font-bold'>{displayDZDCurrency(stats.priceStats.avgSellingPrice)}</p>
                    </div>
                    <div className='text-center p-4 bg-gray-50 rounded'>
                        <p className='text-sm text-gray-600'>Valeur Totale</p>
                        <p className='text-xl font-bold'>{displayDZDCurrency(stats.priceStats.totalValue)}</p>
                    </div>
                    <div className='text-center p-4 bg-gray-50 rounded'>
                        <p className='text-sm text-gray-600'>Valeur Vente Totale</p>
                        <p className='text-xl font-bold'>{displayDZDCurrency(stats.priceStats.totalSellingValue)}</p>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Produits récents */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                    <h2 className='text-xl font-bold mb-4'>Produits Récents</h2>
                    <div className='space-y-3 max-h-96 overflow-y-auto'>
                        {stats.recentProducts.map((product, index) => (
                            <div key={index} className='flex items-center gap-3 p-3 bg-gray-50 rounded border'>
                                <div className='flex-1'>
                                    <p className='font-semibold'>{product.productName}</p>
                                    <p className='text-sm text-gray-600'>
                                        {product.brandName} • {product.category}
                                    </p>
                                    <p className='text-xs text-gray-500 mt-1'>
                                        {moment(product.createdAt).format('LL')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Utilisateurs récents */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                    <h2 className='text-xl font-bold mb-4'>Utilisateurs Récents</h2>
                    <div className='space-y-3 max-h-96 overflow-y-auto'>
                        {stats.recentUsers.map((user, index) => (
                            <div key={index} className='flex items-center justify-between p-3 bg-gray-50 rounded border'>
                                <div className='flex-1'>
                                    <p className='font-semibold'>{user.name}</p>
                                    <p className='text-sm text-gray-600'>{user.email}</p>
                                    <p className='text-xs text-gray-500 mt-1'>
                                        {moment(user.createdAt).format('LL')}
                                    </p>
                                </div>
                                <span className='px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold'>
                                    {user.role}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard

