import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SummaryApi from '../common'
import VerticalCard from '../components/VerticalCard'

const SearchProduct = () => {
  const query = useLocation()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  console.log("query", query.search)

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(SummaryApi.searchProduct.url + query.search)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const dataResponse = await response.json()
      setData(dataResponse.data || [])
    } catch (error) {
      console.error('Error fetching search products:', error.message)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [query])

  return (
    <div className='container mx-auto px-4 md:px-8 py-8'>
      {
        loading && (
          <div className='flex justify-center items-center h-40'>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )
      }

      <p className='text-xl font-bold font-heading my-4 text-text-main'>Search Results : <span className='text-primary'>{data.length}</span></p>

      {
        data.length === 0 && !loading && (
          <div className='bg-white text-lg text-center p-12 shadow-soft rounded-2xl'>
            <p className='text-text-secondary'>No Data Found....</p>
          </div>
        )
      }


      {
        data.length !== 0 && !loading && (
          <VerticalCard loading={loading} data={data} />
        )
      }

    </div>
  )
}

export default SearchProduct
