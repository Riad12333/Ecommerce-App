import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import displayDZDCurrency from '../helpers/displayCurrency'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import addToCart from '../helpers/addToCart'
import Context from '../context'

const HorizontalCardProduct = ({ category, heading }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const loadingList = new Array(13).fill(null)

    const scrollElement = useRef()


    const { fetchUserAddToCart } = useContext(Context)

    const handleAddToCart = async (e, id) => {
        await addToCart(e, id)
        fetchUserAddToCart()
    }

    const fetchData = useCallback(async () => {
        setLoading(true)
        const categoryProduct = await fetchCategoryWiseProduct(category)
        setLoading(false)

        console.log("horizontal data", categoryProduct.data)
        setData(Array.isArray(categoryProduct?.data) ? categoryProduct.data : [])
    }, [category])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const scrollRight = () => {
        scrollElement.current.scrollLeft += 300
    }
    const scrollLeft = () => {
        scrollElement.current.scrollLeft -= 300
    }


    return (
        <div className='container mx-auto px-4 md:px-8 my-6 relative'>

            <h2 className='text-xl md:text-2xl font-bold font-heading mb-4 text-text-main flex items-center gap-2'>
                <span className="w-1.5 h-8 bg-accent rounded-full inline-block"></span>
                {heading}
            </h2>


            <div className='flex items-center gap-4 md:gap-6 overflow-x-auto scrollbar-none transition-all pb-4' ref={scrollElement}>

                <button className='bg-white shadow-md rounded-full p-2 absolute left-0 text-xl hidden md:block z-20 hover:bg-primary hover:text-white transition-colors top-[55%] -translate-y-1/2' onClick={scrollLeft}><FaAngleLeft /></button>
                <button className='bg-white shadow-md rounded-full p-2 absolute right-0 text-xl hidden md:block z-20 hover:bg-primary hover:text-white transition-colors top-[55%] -translate-y-1/2' onClick={scrollRight}><FaAngleRight /></button>

                {
                    loading ? (
                        loadingList.map((product, index) => {
                            return (
                                <div className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-white rounded-lg shadow-sm flex border border-gray-100 animate-pulse' key={index}>
                                    <div className='bg-gray-100 h-full p-4 min-w-[120px] md:min-w-[145px] rounded-l-lg'></div>
                                    <div className='p-4 grid w-full gap-2'>
                                        <h2 className='font-medium text-base md:text-lg p-1 py-1 rounded-full bg-slate-100 w-3/4'></h2>
                                        <p className='text-slate-500 p-1 rounded-full bg-slate-100 w-1/2'></p>
                                        <div className='flex gap-3 w-full mt-auto'>
                                            <p className='p-1 bg-slate-100 w-full rounded-full'></p>
                                            <p className='p-1 bg-slate-100 w-full rounded-full'></p>
                                        </div>
                                        <button className='px-3 py-1 rounded-full w-full bg-slate-100'></button>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        data.map((product, index) => {
                            return (
                                <Link to={"product/" + product?._id} className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-40 bg-white rounded-xl shadow-soft hover:shadow-hover transition-all flex border border-transparent hover:border-gray-100 group overflow-hidden relative' key={product?._id}>
                                    <div className='bg-background h-full p-4 min-w-[120px] md:min-w-[145px] flex items-center justify-center '>
                                        <img src={product?.productImage?.[0]} className='object-contain h-full w-full group-hover:scale-110 transition-transform duration-300 mix-blend-multiply' />
                                    </div>
                                    <div className='p-4 flex flex-col justify-between w-full'>
                                        <div>
                                            <p className='capitalize text-text-secondary text-xs mb-1 bg-gray-100 w-fit px-2 py-0.5 rounded-full'>{product?.category}</p>
                                            <h2 className='font-bold text-base text-text-main line-clamp-1 group-hover:text-primary transition-colors'>{product?.productName}</h2>
                                        </div>

                                        <div className='flex gap-2 items-end mt-1'>
                                            <p className='text-primary font-bold text-lg'>{displayDZDCurrency(product?.sellingPrice)}</p>
                                            <p className='text-text-secondary text-xs line-through mb-1'>{displayDZDCurrency(product?.price)}</p>
                                        </div>
                                        <button className='text-sm bg-primary/10 hover:bg-primary text-primary hover:text-white px-3 py-1.5 rounded-lg font-medium w-fit transition-all mt-2' onClick={(e) => handleAddToCart(e, product?._id)}>Add to Cart</button>
                                    </div>
                                </Link>
                            )
                        })
                    )
                }
            </div>
        </div>
    )
}

export default HorizontalCardProduct
