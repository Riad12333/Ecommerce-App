import React, { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import productCategory from '../helpers/productCategory'
import VerticalCard from '../components/VerticalCard'
import SummaryApi from '../common'
import { FaAngleLeft } from 'react-icons/fa'

const CategoryProduct = () => {
    const [data,setData] = useState([])
    const navigate = useNavigate()
    const [loading] = useState(false)
    const location = useLocation()
    const urlSearch = new URLSearchParams(location.search)
    const urlCategoryListinArray = urlSearch.getAll("category")

    const urlCategoryListObject = {}
    urlCategoryListinArray.forEach(el =>{
      urlCategoryListObject[el] = true
    })

    const [selectCategory,setSelectCategory] = useState(urlCategoryListObject)
    const [filterCategoryList,setFilterCategoryList] = useState([])

    const [sortBy,setSortBy] = useState("")

    const fetchData = useCallback(async()=>{
      try {
        const response = await fetch(SummaryApi.filterProduct.url,{
          method : SummaryApi.filterProduct.method,
          headers : {
            "content-type" : "application/json"
          },
          body : JSON.stringify({
            category : filterCategoryList
          })
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const dataResponse = await response.json()
        setData(dataResponse?.data || [])
      } catch (error) {
        console.error('Error fetching filtered products:', error.message)
        setData([])
      }
    },[filterCategoryList])

    const handleSelectCategory = (e) =>{
      const { value, checked} =  e.target

      setSelectCategory((preve)=>{
        return{
          ...preve,
          [value] : checked
        }
      })
    }

    useEffect(()=>{
      fetchData()
    },[fetchData])

    useEffect(()=>{
      const arrayOfCategory = Object.keys(selectCategory).map(categoryKeyName =>{
        if(selectCategory[categoryKeyName]){
          return categoryKeyName
        }
        return null
      }).filter(el => el)

      setFilterCategoryList(arrayOfCategory)

      //format for url change when change on the checkbox
      const urlFormat = arrayOfCategory.map((el,index) => {
        if((arrayOfCategory.length - 1 ) === index  ){
          return `category=${el}`
        }
        return `category=${el}&&`
      })

      navigate("/product-category?"+urlFormat.join(""))
    },[selectCategory, navigate])


    const handleOnChangeSortBy = (e)=>{
      const { value } = e.target

      setSortBy(value)

      if(value === 'asc'){
        setData(preve => preve.sort((a,b)=>a.sellingPrice - b.sellingPrice))
      }

      if(value === 'dsc'){
        setData(preve => preve.sort((a,b)=>b.sellingPrice - a.sellingPrice))
      }
    }

    useEffect(()=>{

    },[sortBy])
    
  return (
    <div className='container mx-auto p-4'>

       {/***mobile version */}
       <div className='lg:hidden'>
         <div className='flex flex-col gap-2 mb-4'>
           <h2 className='text-xl font-bold text-slate-800 mb-2'>Catégories</h2>
           {
             productCategory.map((categoryName, index) => {
               const isSelected = selectCategory[categoryName?.value]
               return (
                 <Link
                   key={categoryName?.value || index}
                   to={`/product-category?category=${categoryName?.value}`}
                   className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                     isSelected ? 'bg-red-50 border-2 border-red-600' : 'bg-white border border-slate-200 hover:bg-slate-50'
                   }`}
                 >
                   <div className='bg-slate-200 rounded-full p-2'>
                     <FaAngleLeft className='text-slate-600' />
                   </div>
                   <span className={`font-semibold flex-1 ${isSelected ? 'text-red-600' : 'text-slate-800'}`}>
                     {categoryName?.label}
                   </span>
                 </Link>
               )
             })
           }
         </div>

         <div className='mt-4'>
           <p className='font-medium text-slate-800 text-lg my-2'>Résultats : {data.length}</p>
           <div className='min-h-[calc(100vh-200px)]'>
             {
               data.length !== 0 && !loading && (
                 <VerticalCard data={data} loading={loading} />
               )
             }
             {
               data.length === 0 && !loading && (
                 <p className='text-center text-slate-500 py-8'>Aucun produit trouvé pour cette catégorie</p>
               )
             }
           </div>
         </div>
       </div>

       {/***desktop version */}
       <div className='hidden lg:grid grid-cols-[200px,1fr]'>
           {/***left side */}
           <div className='bg-white p-2 min-h-[calc(100vh-120px)] overflow-y-scroll'>
                {/**sort by */}
                <div className=''>
                    <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Sort by</h3>

                    <form className='text-sm flex flex-col gap-2 py-2'>
                        <div className='flex items-center gap-3'>
                          <input type='radio' name='sortBy' checked={sortBy === 'asc'} onChange={handleOnChangeSortBy} value={"asc"}/>
                          <label>Price - Low to High</label>
                        </div>

                        <div className='flex items-center gap-3'>
                          <input type='radio' name='sortBy' checked={sortBy === 'dsc'} onChange={handleOnChangeSortBy} value={"dsc"}/>
                          <label>Price - High to Low</label>
                        </div>
                    </form>
                </div>


                {/**filter by */}
                <div className=''>
                    <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Category</h3>

                    <form className='text-sm flex flex-col gap-2 py-2'>
                        {
                          productCategory.map((categoryName,index)=>{
                            return(
                              <div className='flex items-center gap-3'>
                                 <input type='checkbox' name={"category"} checked={selectCategory[categoryName?.value]} value={categoryName?.value} id={categoryName?.value} onChange={handleSelectCategory} />
                                 <label htmlFor={categoryName?.value}>{categoryName?.label}</label>
                              </div>
                            )
                          })
                        }
                    </form>
                </div>


           </div>


            {/***right side ( product ) */}
            <div className='px-4'>
              <p className='font-medium text-slate-800 text-lg my-2'>Search Results : {data.length}</p>

             <div className='min-h-[calc(100vh-120px)] overflow-y-scroll max-h-[calc(100vh-120px)]'>
              {
                  data.length !== 0 && !loading && (
                    <VerticalCard data={data} loading={loading}/>
                  )
              }
             </div>
            </div>
       </div>
       
    </div>
  )
}

export default CategoryProduct
