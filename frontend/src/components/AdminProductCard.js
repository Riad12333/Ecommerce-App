import React, { useState } from 'react'
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import AdminEditProduct from './AdminEditProduct';
import displayDZDCurrency from '../helpers/displayCurrency';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const AdminProductCard = ({
    data,
    fetchdata
}) => {
    const [editProduct,setEditProduct] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleDeleteProduct = async () => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${data.productName}" ?`)) {
            setLoading(true)
            try {
                const response = await fetch(SummaryApi.deleteProduct.url, {
                    method: SummaryApi.deleteProduct.method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        productId: data._id
                    })
                })

                const dataResponse = await response.json()

                if (dataResponse.success) {
                    toast.success('Produit supprimé avec succès')
                    fetchdata()
                } else {
                    toast.error(dataResponse.message)
                }
            } catch (error) {
                console.error('Error deleting product:', error)
                toast.error('Erreur lors de la suppression du produit')
            } finally {
                setLoading(false)
            }
        }
    }

  return (
    <div className='bg-white p-4 rounded '>
       <div className='w-40'>
            <div className='w-32 h-32 flex justify-center items-center'>
              <img src={data?.productImage[0]} alt={data?.productName || data?.category || 'product image'}  className='mx-auto object-fill h-full'/>   
            </div> 
            <h1 className='text-ellipsis line-clamp-2'>{data.productName}</h1>

            <div>

                <p className='font-semibold'>
                  {
                    displayDZDCurrency(data.sellingPrice)
                  }
        
                </p>

                <div className='flex gap-2 w-fit ml-auto'>
                    <div className='p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer' onClick={()=>setEditProduct(true)}>
                        <MdModeEditOutline/>
                    </div>
                    <div 
                        className={`p-2 bg-red-100 hover:bg-red-600 rounded-full hover:text-white cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={!loading ? handleDeleteProduct : undefined}
                    >
                        <MdDelete/>
                    </div>
                </div>

            </div>

          
       </div>
        
        {
          editProduct && (
            <AdminEditProduct productData={data} onClose={()=>setEditProduct(false)} fetchdata={fetchdata}/>
          )
        }
    
    </div>
  )
}

export default AdminProductCard
