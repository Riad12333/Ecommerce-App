import React, { useContext } from 'react'
import scrollTop from '../helpers/scrollTop'
import displayDZDCurrency from '../helpers/displayCurrency'
import Context from '../context'
import addToCart from '../helpers/addToCart'
import { Link } from 'react-router-dom'
import { FaShoppingCart } from 'react-icons/fa'

const VerticalCard = ({ loading, data = [] }) => {
    const loadingList = new Array(13).fill(null)
    const { fetchUserAddToCart } = useContext(Context)

    const handleAddToCart = async (e, id) => {
        await addToCart(e, id)
        fetchUserAddToCart()
    }

    return (
        <div className='grid grid-cols-[repeat(auto-fit,minmax(260px,320px))] justify-center md:gap-6 overflow-x-hidden transition-all'>
            {

                loading ? (
                    loadingList.map((product, index) => {
                        return (
                            <div className='w-full min-w-[280px]  md:min-w-[320px] max-w-[280px] md:max-w-[320px]  bg-white rounded-xl shadow-soft animate-pulse' key={index}>
                                <div className='bg-slate-100 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center rounded-t-xl'>
                                </div>
                                <div className='p-4 grid gap-3'>
                                    <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black p-1 py-2 rounded-full bg-slate-100'>
                                    </h2>
                                    <p className='capitalize text-slate-500 p-1 rounded-full bg-slate-100  py-2'></p>
                                    <div className='flex gap-3'>
                                        <p className='text-red-600 font-medium p-1 rounded-full bg-slate-100 w-full  py-2'></p>
                                        <p className='text-slate-500 line-through p-1 rounded-full bg-slate-100 w-full  py-2'></p>
                                    </div>
                                    <button className='text-sm  text-white px-3  rounded-full bg-slate-100  py-2'></button>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    data.map((product, index) => {
                        return (
                            <Link to={"/product/" + product?._id} className='w-full min-w-[280px]  md:min-w-[300px] max-w-[280px] md:max-w-[300px] bg-white rounded-xl shadow-soft hover:shadow-hover transition-all flex flex-col border border-transparent hover:border-gray-100 group overflow-hidden relative' onClick={scrollTop} key={product?._id}>
                                <div className='bg-background h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center relative'>
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="bg-white p-2 rounded-full shadow-md text-text-secondary hover:text-primary transition-colors"><FaShoppingCart /></button>
                                    </div>
                                    <img src={product?.productImage[0]} alt={product?.productName || product?.category || 'product image'} className='object-contain h-full w-full group-hover:scale-110 transition-transform duration-300 mix-blend-multiply' />
                                </div>
                                <div className='p-4 flex flex-col gap-2 flex-grow'>
                                    <p className='capitalize text-text-secondary text-xs bg-gray-100 w-fit px-2 py-0.5 rounded-full'>{product?.category}</p>
                                    <h2 className='font-bold text-base md:text-lg text-text-main line-clamp-1 group-hover:text-primary transition-colors'>{product?.productName}</h2>
                                    <div className='flex gap-2 items-end mt-auto'>
                                        <p className='text-primary font-bold text-lg'>{displayDZDCurrency(product?.sellingPrice)}</p>
                                        <p className='text-text-secondary text-sm line-through mb-1'>{displayDZDCurrency(product?.price)}</p>
                                    </div>
                                    <button className='hidden md:block w-full text-sm bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-lg font-medium transition-all mt-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300' onClick={(e) => handleAddToCart(e, product?._id)}>Add to Cart</button>
                                    <button className='md:hidden w-full text-sm bg-primary text-white px-3 py-2 rounded-lg font-medium mt-3' onClick={(e) => handleAddToCart(e, product?._id)}>Add to Cart</button>
                                </div>
                            </Link>
                        )
                    })
                )

            }
        </div>
    )
}

export default VerticalCard
