import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SummaryApi from '../common'
import Context from '../context'
import displayDZDCurrency from '../helpers/displayCurrency'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'

const Checkout = () => {
    const [cartData, setCartData] = useState([])
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const context = useContext(Context)
    const user = useSelector(state => state?.user?.user)
    const navigate = useNavigate()

    const [shippingAddress, setShippingAddress] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
    })

    const fetchCartData = async () => {
        try {
            const response = await fetch(SummaryApi.addToCartProductView.url, {
                method: SummaryApi.addToCartProductView.method,
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const responseData = await response.json()

            if (responseData.success) {
                setCartData(responseData.data || [])
            } else {
                setCartData([])
            }
        } catch (error) {
            console.error('Error fetching cart data:', error.message)
            setCartData([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setLoading(true)
        fetchCartData()
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setShippingAddress(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const validateForm = () => {
        const missingFields = []
        
        if (!shippingAddress.name || shippingAddress.name.trim() === '') {
            missingFields.push('Nom complet')
        }
        if (!shippingAddress.email || shippingAddress.email.trim() === '') {
            missingFields.push('Email')
        }
        if (!shippingAddress.phone || shippingAddress.phone.trim() === '') {
            missingFields.push('Téléphone')
        }
        if (!shippingAddress.address || shippingAddress.address.trim() === '') {
            missingFields.push('Adresse')
        }
        if (!shippingAddress.city || shippingAddress.city.trim() === '') {
            missingFields.push('Ville')
        }
        if (!shippingAddress.state || shippingAddress.state.trim() === '') {
            missingFields.push('État')
        }
        if (!shippingAddress.zipCode || shippingAddress.zipCode.trim() === '') {
            missingFields.push('Code postal')
        }
        
        if (missingFields.length > 0) {
            toast.error(`Champs manquants: ${missingFields.join(', ')}`)
            return false
        }
        
        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(shippingAddress.email)) {
            toast.error('Email invalide')
            return false
        }
        
        // Validation téléphone (au moins 10 chiffres)
        const phoneRegex = /^[0-9]{10,}$/
        if (!phoneRegex.test(shippingAddress.phone.replace(/\s+/g, ''))) {
            toast.error('Numéro de téléphone invalide (minimum 10 chiffres)')
            return false
        }
        
        return true
    }

    const handlePlaceOrder = async (paymentMethod = 'COD') => {
        if (!validateForm()) return

        console.log('=== FRONTEND: Placing order ===')
        console.log('Shipping address:', JSON.stringify(shippingAddress, null, 2))
        console.log('Payment method:', paymentMethod)
        console.log('User:', JSON.stringify(user, null, 2))

        setSubmitting(true)
        try {
            const response = await fetch(SummaryApi.createOrder.url, {
                method: SummaryApi.createOrder.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    shippingAddress,
                    paymentMethod,
                    notes: ''
                })
            })
            
            console.log('Response status:', response.status)

            let responseData
            try {
                responseData = await response.json()
            } catch (jsonError) {
                console.error('Error parsing JSON:', jsonError)
                throw new Error(`Erreur de réponse serveur (${response.status})`)
            }

            if (!response.ok) {
                console.error('Order creation failed:', JSON.stringify(responseData, null, 2))
                let errorMessage = responseData?.message || responseData?.error || `Erreur ${response.status}: Impossible de créer la commande`
                
                // Améliorer le message si le produit est introuvable
                if (errorMessage.includes('Produit introuvable')) {
                    errorMessage = "Un produit de votre panier n'est plus disponible. Veuillez mettre à jour votre panier."
                }
                
                toast.error(errorMessage)
                console.error('Full response data:', JSON.stringify(responseData, null, 2))
                return
            }

            if (responseData.success) {
                toast.success('Commande passée avec succès!')
                context.fetchUserAddToCart()
                navigate(`/order-success/${responseData.data._id}`)
            } else {
                console.error('Order creation error:', responseData)
                toast.error(responseData.message || 'Erreur lors de la création de la commande')
            }
        } catch (error) {
            console.error('Error placing order:', error)
            
            if (error.message && error.message.includes('réponse serveur')) {
                toast.error(error.message)
            } else {
                toast.error('Erreur de connexion. Vérifiez que le serveur backend est démarré.')
            }
        } finally {
            setSubmitting(false)
        }
    }

    const totalQty = cartData.reduce((prev, curr) => prev + (curr?.quantity || 0), 0)
    const totalPrice = cartData.reduce((prev, curr) => {
        const qty = curr?.quantity || 0
        const price = curr?.productId?.sellingPrice || 0
        return prev + (qty * price)
    }, 0)

    if (loading) {
        return (
            <div className='container mx-auto p-4'>
                <div className='text-center'>Chargement...</div>
            </div>
        )
    }

    if (cartData.length === 0) {
        return (
            <div className='container mx-auto p-4'>
                <div className='text-center py-8'>
                    <p className='text-xl mb-4'>Votre panier est vide</p>
                    <button
                        onClick={() => navigate('/')}
                        className='bg-blue-600 text-white px-6 py-2 rounded'
                    >
                        Continuer les achats
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='container mx-auto p-4'>
            <h1 className='text-2xl font-bold mb-6'>Finaliser la commande</h1>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {/* Formulaire d'adresse */}
                <div className='lg:col-span-2'>
                    <div className='bg-white p-6 rounded shadow'>
                        <h2 className='text-xl font-semibold mb-4'>Adresse de livraison</h2>
                        <div className='space-y-4'>
                            <div>
                                <label className='block text-sm font-medium mb-1'>Nom complet *</label>
                                <input
                                    type='text'
                                    name='name'
                                    value={shippingAddress.name}
                                    onChange={handleInputChange}
                                    className='w-full border rounded px-3 py-2'
                                    required
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium mb-1'>Email *</label>
                                <input
                                    type='email'
                                    name='email'
                                    value={shippingAddress.email}
                                    onChange={handleInputChange}
                                    className='w-full border rounded px-3 py-2'
                                    required
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium mb-1'>Téléphone *</label>
                                <input
                                    type='tel'
                                    name='phone'
                                    value={shippingAddress.phone}
                                    onChange={handleInputChange}
                                    className='w-full border rounded px-3 py-2'
                                    required
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium mb-1'>Adresse *</label>
                                <textarea
                                    name='address'
                                    value={shippingAddress.address}
                                    onChange={handleInputChange}
                                    className='w-full border rounded px-3 py-2'
                                    rows='3'
                                    required
                                />
                            </div>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium mb-1'>Ville *</label>
                                    <input
                                        type='text'
                                        name='city'
                                        value={shippingAddress.city}
                                        onChange={handleInputChange}
                                        className={`w-full border rounded px-3 py-2 ${
                                            !shippingAddress.city ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                        placeholder='Entrez votre ville'
                                    />
                                    {!shippingAddress.city && (
                                        <p className='text-red-500 text-xs mt-1'>Ce champ est requis</p>
                                    )}
                                </div>
                                <div>
                                    <label className='block text-sm font-medium mb-1'>État *</label>
                                    <input
                                        type='text'
                                        name='state'
                                        value={shippingAddress.state}
                                        onChange={handleInputChange}
                                        className={`w-full border rounded px-3 py-2 ${
                                            !shippingAddress.state ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                        placeholder='Entrez votre état/région'
                                    />
                                    {!shippingAddress.state && (
                                        <p className='text-red-500 text-xs mt-1'>Ce champ est requis</p>
                                    )}
                                </div>
                            </div>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium mb-1'>Code postal *</label>
                                    <input
                                        type='text'
                                        name='zipCode'
                                        value={shippingAddress.zipCode}
                                        onChange={handleInputChange}
                                        className={`w-full border rounded px-3 py-2 ${
                                            !shippingAddress.zipCode ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                        placeholder='Ex: 75001'
                                    />
                                    {!shippingAddress.zipCode && (
                                        <p className='text-red-500 text-xs mt-1'>Ce champ est requis</p>
                                    )}
                                </div>
                                <div>
                                    <label className='block text-sm font-medium mb-1'>Pays *</label>
                                    <input
                                        type='text'
                                        name='country'
                                        value={shippingAddress.country}
                                        onChange={handleInputChange}
                                        className='w-full border rounded px-3 py-2'
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Résumé des produits */}
                    <div className='bg-white p-6 rounded shadow mt-6'>
                        <h2 className='text-xl font-semibold mb-4'>Résumé de la commande</h2>
                        <div className='space-y-3'>
                            {cartData.map((item, index) => (
                                <div key={index} className='flex items-center gap-4 border-b pb-3'>
                                    <img
                                        src={item?.productId?.productImage?.[0]}
                                        alt={item?.productId?.productName}
                                        className='w-20 h-20 object-cover rounded'
                                    />
                                    <div className='flex-1'>
                                        <p className='font-medium'>{item?.productId?.productName}</p>
                                        <p className='text-sm text-gray-600'>
                                            Quantité: {item?.quantity} × {displayDZDCurrency(item?.productId?.sellingPrice)}
                                        </p>
                                    </div>
                                    <p className='font-semibold'>
                                        {displayDZDCurrency((item?.quantity || 0) * (item?.productId?.sellingPrice || 0))}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Panneau de paiement */}
                <div className='lg:col-span-1'>
                    <div className='bg-white p-6 rounded shadow sticky top-4'>
                        <h2 className='text-xl font-semibold mb-4'>Résumé</h2>
                        <div className='space-y-3 mb-4'>
                            <div className='flex justify-between'>
                                <span>Quantité totale:</span>
                                <span className='font-medium'>{totalQty}</span>
                            </div>
                            <div className='flex justify-between text-lg font-bold border-t pt-3'>
                                <span>Total:</span>
                                <span>{displayDZDCurrency(totalPrice)}</span>
                            </div>
                        </div>

                        <div className='mb-4'>
                            <label className='block text-sm font-medium mb-2'>Méthode de paiement</label>
                            <select className='w-full border rounded px-3 py-2' defaultValue='COD'>
                                <option value='COD'>Paiement à la livraison (COD)</option>
                                <option value='ONLINE' disabled>Paiement en ligne (Bientôt disponible)</option>
                                <option value='CARD' disabled>Carte bancaire (Bientôt disponible)</option>
                            </select>
                        </div>

                        <button
                            onClick={() => handlePlaceOrder('COD')}
                            disabled={submitting}
                            className={`w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition ${
                                submitting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {submitting ? 'Traitement...' : 'Passer la commande'}
                        </button>

                        <button
                            onClick={() => navigate('/cart')}
                            className='w-full bg-gray-200 text-gray-800 py-2 rounded mt-2 hover:bg-gray-300 transition'
                        >
                            Retour au panier
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout

