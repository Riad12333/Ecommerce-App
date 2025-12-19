import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { Link } from 'react-router-dom'

const CategoryList = () => {
    const [categoryProduct, setCategoryProduct] = useState([])
    const [loading, setLoading] = useState(false)

    const categoryLoading = new Array(13).fill(null)

    const fetchCategoryProduct = async () => {
        try {
            setLoading(true)
            const response = await fetch(SummaryApi.categoryProduct.url)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const dataResponse = await response.json()
            setCategoryProduct(Array.isArray(dataResponse?.data) ? dataResponse.data : [])
        } catch (error) {
            console.error('Error fetching category products:', error.message)
            setCategoryProduct([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategoryProduct()
    }, [])


    return (
        <div className='container mx-auto p-4 md:px-8'>
            <div className='flex items-center gap-6 justify-between overflow-x-auto scrollbar-none py-6'>
                {

                    loading ? (
                        categoryLoading.map((el, index) => {
                            return (
                                <div className='h-20 w-20 md:w-28 md:h-28 rounded-full overflow-hidden bg-white shadow-soft animate-pulse flex-shrink-0 border border-gray-100' key={"categoryLoading" + index}>
                                </div>
                            )
                        })
                    ) :
                        (
                            (Array.isArray(categoryProduct) ? categoryProduct : []).map((product, index) => {
                                return (
                                    <Link to={"/product-category?category=" + product?.category} className='cursor-pointer group flex flex-col items-center gap-2 flex-shrink-0' key={product?.category}>
                                        <div className='w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden p-5 bg-white shadow-soft transition-all duration-300 group-hover:shadow-hover group-hover:-translate-y-1 border border-transparent group-hover:border-secondary/20 flex items-center justify-center relative z-10'>
                                            <img src={product?.productImage?.[0]} alt={product?.category} className='h-full w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300' />
                                        </div>
                                        <p className='text-center text-sm md:text-base capitalize font-medium text-text-main group-hover:text-primary transition-colors'>{product?.category}</p>
                                    </Link>
                                )
                            })
                        )
                }
            </div>
        </div >
    )
}

export default CategoryList
