import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SummaryApi from '../common'
import Context from '../context'
import displayDZDCurrency from '../helpers/displayCurrency'
import { MdDelete } from "react-icons/md";

const Cart = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const context = useContext(Context)
    const navigate = useNavigate()
    const loadingCart = new Array(4).fill(null)


    const fetchData = async () => {
        try {
            const response = await fetch(SummaryApi.addToCartProductView.url, {
                method: SummaryApi.addToCartProductView.method,
                credentials: 'include',
                headers: {
                    "content-type": 'application/json'
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const responseData = await response.json()

            if (responseData.success) {
                setData(responseData.data || [])
            } else {
                setData([])
            }
        } catch (error) {
            console.error('Error fetching cart data:', error.message)
            setData([])
        }
    }

    useEffect(() => {
        const run = async () => {
            setLoading(true)
            await fetchData()
            setLoading(false)
        }
        run()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Recharger le panier quand le compteur change (connexion/déconnexion)
    useEffect(() => {
        fetchData()
    }, [context.cartProductCount]) // eslint-disable-line react-hooks/exhaustive-deps


    const increaseQty = async (id, qty) => {
        try {
            const response = await fetch(SummaryApi.updateCartProduct.url, {
                method: SummaryApi.updateCartProduct.method,
                credentials: 'include',
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify(
                    {
                        _id: id,
                        quantity: qty + 1
                    }
                )
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const responseData = await response.json()

            if (responseData.success) {
                fetchData()
            }
        } catch (error) {
            console.error('Error updating cart quantity:', error.message)
        }
    }


    const decraseQty = async (id, qty) => {
        if (qty >= 2) {
            try {
                const response = await fetch(SummaryApi.updateCartProduct.url, {
                    method: SummaryApi.updateCartProduct.method,
                    credentials: 'include',
                    headers: {
                        "content-type": 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            _id: id,
                            quantity: qty - 1
                        }
                    )
                })

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const responseData = await response.json()

                if (responseData.success) {
                    fetchData()
                }
            } catch (error) {
                console.error('Error decreasing cart quantity:', error.message)
            }
        }
    }

    const deleteCartProduct = async (id) => {
        try {
            const response = await fetch(SummaryApi.deleteCartProduct.url, {
                method: SummaryApi.deleteCartProduct.method,
                credentials: 'include',
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify(
                    {
                        _id: id,
                    }
                )
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const responseData = await response.json()

            if (responseData.success) {
                fetchData()
                context.fetchUserAddToCart()
            }
        } catch (error) {
            console.error('Error deleting cart product:', error.message)
        }
    }

    const totalQty = data.reduce((previousValue, currentValue) => {
        return previousValue + (currentValue?.quantity || 0)
    }, 0)

    const totalPrice = data.reduce((preve, curr) => {
        const qty = curr?.quantity || 0
        const price = curr?.productId?.sellingPrice || 0
        return preve + (qty * price)
    }, 0)
    return (
        <div className='container mx-auto px-4 md:px-8 py-8'>

            <div className='text-center text-lg my-3'>
                {
                    data.length === 0 && !loading && (
                        <div className='bg-white py-12 shadow-soft rounded-2xl flex flex-col items-center justify-center gap-4'>
                            <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                            <p className='text-text-secondary font-medium text-xl'>Your Cart is Empty</p>
                            <button onClick={() => navigate("/")} className='bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-primary-light transition-colors mt-2'>Start Shopping</button>
                        </div>
                    )
                }
            </div>

            <div className='flex flex-col lg:flex-row gap-10 lg:justify-between '>
                {/***view product */}
                <div className='w-full max-w-3xl space-y-4'>
                    {
                        loading ? (
                            loadingCart?.map((el, index) => {
                                return (
                                    <div key={el + "Add To Cart Loading" + index} className='w-full bg-slate-100 h-32 border border-gray-100 animate-pulse rounded-xl'>
                                    </div>
                                )
                            })

                        ) : (
                            data.filter(product => product?.productId).map((product, index) => {
                                const productData = product?.productId
                                const productImage = productData?.productImage?.[0] || ''
                                const productName = productData?.productName || 'Product'
                                const category = productData?.category || ''
                                const sellingPrice = productData?.sellingPrice || 0
                                const quantity = product?.quantity || 1

                                return (
                                    <div key={product?._id || index} className='w-full bg-white text-text-main h-auto md:h-32 border border-gray-100 rounded-xl grid grid-cols-[100px,1fr] md:grid-cols-[128px,1fr] overflow-hidden shadow-soft hover:shadow-md transition-shadow'>
                                        <div className='w-full h-full bg-slate-50 p-2 flex items-center justify-center'>
                                            {productImage ? (
                                                <img src={productImage} alt={productName} className='w-full h-full object-contain mix-blend-multiply' />
                                            ) : (
                                                <div className='text-slate-400 text-xs text-center'>No Image</div>
                                            )}
                                        </div>
                                        <div className='px-4 py-3 relative flex flex-col justify-between'>
                                            {/**delete product */}
                                            <div className='absolute right-3 top-3 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-full p-2 cursor-pointer transition-colors' onClick={() => deleteCartProduct(product?._id)}>
                                                <MdDelete className='text-lg' />
                                            </div>

                                            <div>
                                                <h2 className='text-base md:text-xl font-bold line-clamp-1 pr-8 text-text-main'>{productName}</h2>
                                                <p className='capitalize text-text-secondary text-sm'>{category}</p>
                                            </div>

                                            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2'>
                                                <div className='flex items-center gap-2'>
                                                    <p className='text-primary font-bold text-lg'>{displayDZDCurrency(sellingPrice)}</p>
                                                    {quantity > 1 && <span className='text-xs text-text-secondary'>x {quantity}</span>}
                                                </div>

                                                <div className='flex items-center justify-between w-full md:w-auto gap-4'>
                                                    <div className='flex items-center gap-3 border border-gray-200 rounded-full px-2 py-1 bg-white'>
                                                        <button className='w-6 h-6 flex justify-center items-center text-text-secondary hover:text-primary font-medium text-lg' onClick={() => decraseQty(product?._id, quantity)}>-</button>
                                                        <span className='w-4 text-center font-medium'>{quantity}</span>
                                                        <button className='w-6 h-6 flex justify-center items-center text-text-secondary hover:text-primary font-medium text-lg' onClick={() => increaseQty(product?._id, quantity)}>+</button>
                                                    </div>
                                                    <p className='text-text-main font-bold text-lg md:hidden block'>{displayDZDCurrency(sellingPrice * quantity)}</p>
                                                </div>
                                                <p className='text-text-main font-bold text-lg hidden md:block'>{displayDZDCurrency(sellingPrice * quantity)}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )
                    }
                </div>


                {/***summary  */}
                <div className='mt-8 lg:mt-0 w-full max-w-sm'>
                    {
                        loading ? (
                            <div className='h-48 bg-slate-100 rounded-xl animate-pulse'>

                            </div>
                        ) : (
                            <div className='bg-white rounded-2xl shadow-soft p-6 border border-gray-100 sticky top-24'>
                                <h2 className='text-xl font-bold text-primary mb-6 pb-2 border-b border-gray-100'>Order Summary</h2>

                                <div className='space-y-4'>
                                    <div className='flex items-center justify-between font-medium text-text-secondary'>
                                        <p>Total Quantity</p>
                                        <p className='text-text-main font-semibold'>{totalQty}</p>
                                    </div>

                                    <div className='flex items-center justify-between font-medium text-text-secondary'>
                                        <p>Subtotal</p>
                                        <p className='text-text-main font-semibold'>{displayDZDCurrency(totalPrice)}</p>
                                    </div>
                                    <div className='flex items-center justify-between font-bold text-lg text-text-main pt-4 border-t border-gray-100'>
                                        <p>Total</p>
                                        <p className='text-primary'>{displayDZDCurrency(totalPrice)}</p>
                                    </div>
                                </div>

                                <button
                                    className='bg-accent hover:bg-accent-hover text-text-main font-bold py-3 w-full rounded-xl mt-6 transition-all shadow-md hover:shadow-lg transform active:scale-95'
                                    onClick={() => {
                                        if (totalQty > 0) {
                                            navigate('/checkout')
                                        } else {
                                            // Using simple alert as per original code context, ideally usage of toast
                                            alert('Your cart is empty')
                                        }
                                    }}
                                >
                                    Proceed to Checkout
                                </button>

                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Cart
