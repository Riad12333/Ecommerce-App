import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SummaryApi from '../common'
import { FaStar } from "react-icons/fa";
import { FaStarHalf } from "react-icons/fa";
import displayDZDCurrency from '../helpers/displayCurrency';
// removed unused VerticalCardProduct import
import CategroyWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import addToCart from '../helpers/addToCart';
import Context from '../context';

const ProductDetails = () => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: ""
  })
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const productImageListLoading = new Array(4).fill(null)
  const [activeImage, setActiveImage] = useState("")

  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({
    x: 0,
    y: 0
  })
  const [zoomImage, setZoomImage] = useState(false)

  const { fetchUserAddToCart } = useContext(Context)

  const navigate = useNavigate()

  const fetchProductDetails = useCallback(async () => {
    setLoading(true)
    const response = await fetch(SummaryApi.productDetails.url, {
      method: SummaryApi.productDetails.method,
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        productId: params?.id
      })
    })
    setLoading(false)
    const dataReponse = await response.json()

    setData(dataReponse?.data)
    setActiveImage(dataReponse?.data?.productImage[0])

  }, [params?.id])

  console.log("data", data)

  useEffect(() => {
    fetchProductDetails()
  }, [fetchProductDetails])

  const handleMouseEnterProduct = (imageURL) => {
    setActiveImage(imageURL)
  }

  const handleZoomImage = useCallback((e) => {
    setZoomImage(true)
    const { left, top, width, height } = e.target.getBoundingClientRect()
    console.log("coordinate", left, top, width, height)

    const x = (e.clientX - left) / width
    const y = (e.clientY - top) / height

    setZoomImageCoordinate({
      x,
      y
    })
  }, [])

  const handleLeaveImageZoom = () => {
    setZoomImage(false)
  }


  const handleAddToCart = async (e, id) => {
    await addToCart(e, id)
    fetchUserAddToCart()
  }

  const handleBuyProduct = async (e, id) => {
    await addToCart(e, id)
    fetchUserAddToCart()
    navigate("/cart")

  }

  return (
    <div className='container mx-auto px-4 md:px-8 py-8'>

      <div className='min-h-[200px] flex flex-col lg:flex-row gap-8 lg:gap-12'>
        {/***product Image */}
        <div className='h-96 flex flex-col lg:flex-row-reverse gap-4'>

          <div className='h-[300px] w-[300px] lg:h-96 lg:w-96 bg-white shadow-soft rounded-2xl relative p-4 border border-gray-100'>
            <img src={activeImage} alt={data?.productName || data?.category || 'product image'} className='h-full w-full object-contain mix-blend-multiply cursor-crosshair' onMouseMove={handleZoomImage} onMouseLeave={handleLeaveImageZoom} />

            {/**product zoom */}
            {
              zoomImage && (
                <div className='hidden lg:block absolute min-w-[500px] overflow-hidden min-h-[400px] bg-white shadow-hover p-1 -right-[520px] top-0 rounded-xl z-10 border border-gray-100'>
                  <div
                    className='w-full h-full min-h-[400px] min-w-[500px] mix-blend-multiply scale-150'
                    style={{
                      background: `url(${activeImage})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}% `

                    }}
                  >

                  </div>
                </div>
              )
            }

          </div>

          <div className='h-full'>
            {
              loading ? (
                <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                  {
                    productImageListLoading.map((el, index) => {
                      return (
                        <div className='h-20 w-20 bg-slate-100 rounded-lg animate-pulse' key={"loadingImage" + index}>
                        </div>
                      )
                    })
                  }
                </div>

              ) : (
                <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                  {
                    (Array.isArray(data?.productImage) ? data.productImage : []).map((imgURL, index) => {
                      return (
                        <div className={`h-20 w-20 bg-white rounded-lg p-1 border transition-all cursor-pointer ${activeImage === imgURL ? 'border-primary shadow-md' : 'border-gray-100 hover:border-blue-200'}`} key={imgURL}>
                          <img src={imgURL} alt={data?.productName || data?.category || 'product image'} className='w-full h-full object-contain mix-blend-multiply' onMouseEnter={() => handleMouseEnterProduct(imgURL)} onClick={() => handleMouseEnterProduct(imgURL)} />
                        </div>
                      )
                    })
                  }
                </div>
              )
            }
          </div>
        </div>

        {/***product details */}
        {
          loading ? (
            <div className='grid gap-1 w-full'>
              <p className='bg-slate-100 animate-pulse  h-6 lg:h-8 w-full rounded-full inline-block'></p>
              <h2 className='text-2xl lg:text-4xl font-medium h-6 lg:h-8  bg-slate-100 animate-pulse w-full'></h2>
              <p className='capitalize text-slate-400 bg-slate-100 min-w-[100px] animate-pulse h-6 lg:h-8  w-full'></p>

              <div className='text-accent bg-slate-100 h-6 lg:h-8  animate-pulse flex items-center gap-1 w-full'>

              </div>

              <div className='flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1 h-6 lg:h-8  animate-pulse w-full'>
                <p className='text-primary bg-slate-100 w-full'></p>
                <p className='text-text-secondary line-through bg-slate-100 w-full'></p>
              </div>

              <div className='flex items-center gap-3 my-2 w-full'>
                <button className='h-6 lg:h-8  bg-slate-100 rounded animate-pulse w-full'></button>
                <button className='h-6 lg:h-8  bg-slate-100 rounded animate-pulse w-full'></button>
              </div>

              <div className='w-full'>
                <p className='text-text-secondary font-medium my-1 h-6 lg:h-8   bg-slate-100 rounded animate-pulse w-full'></p>
                <p className=' bg-slate-100 rounded animate-pulse h-10 lg:h-12  w-full'></p>
              </div>
            </div>
          ) :
            (
              <div className='flex flex-col gap-3 lg:gap-4'>
                <p className='bg-primary/10 text-primary px-3 py-1 rounded-full inline-block w-fit font-semibold text-sm tracking-wide'>{data?.brandName}</p>
                <h2 className='text-2xl lg:text-4xl font-bold font-heading text-text-main'>{data?.productName}</h2>
                <p className='capitalize text-text-secondary font-medium'>{data?.category}</p>

                <div className='text-accent flex items-center gap-1 text-lg'>
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStarHalf />
                </div>

                <div className='flex items-center gap-4 text-2xl lg:text-3xl font-medium my-2'>
                  <p className='text-primary font-bold'>{displayDZDCurrency(data.sellingPrice)}</p>
                  <p className='text-text-secondary text-xl line-through'>{displayDZDCurrency(data.price)}</p>
                </div>

                <div className='flex items-center gap-3 my-4'>
                  <button className='border-2 border-primary rounded-xl px-6 py-2.5 min-w-[140px] text-primary font-bold hover:bg-primary hover:text-white transition-all duration-300' onClick={(e) => handleBuyProduct(e, data?._id)}>Buy Now</button>
                  <button className='border-2 border-primary rounded-xl px-6 py-2.5 min-w-[140px] font-bold text-white bg-primary hover:bg-primary-light hover:border-primary-light shadow-lg hover:shadow-xl transition-all duration-300' onClick={(e) => handleAddToCart(e, data?._id)}>Add To Cart</button>
                </div>

                <div>
                  <p className='text-text-main font-bold my-2 text-lg'>Description : </p>
                  <p className='text-text-secondary leading-relaxed'>{data?.description}</p>
                </div>
              </div>
            )
        }

      </div>



      {
        data.category && (
          <CategroyWiseProductDisplay category={data?.category} heading={"Recommended Product"} />
        )
      }




    </div>
  )
}

export default ProductDetails
