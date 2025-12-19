import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import moment from 'moment'
import { MdModeEdit, MdDelete } from "react-icons/md";
import ChangeUserRole from '../components/ChangeUserRole';

const AllUsers = () => {
    const [allUser,setAllUsers] = useState([])
    const [openUpdateRole,setOpenUpdateRole] = useState(false)
    const [updateUserDetails,setUpdateUserDetails] = useState({
        email : "",
        name : "",
        role : "",
        _id  : ""
    })
    const [loading, setLoading] = useState({})

    const fetchAllUsers = async() =>{
        try {
            const fetchData = await fetch(SummaryApi.allUser.url,{
                method : SummaryApi.allUser.method,
                credentials : 'include'
            })

            const dataResponse = await fetchData.json()

            if(dataResponse.success){
                setAllUsers(dataResponse.data)
            }

            if(dataResponse.error){
                toast.error(dataResponse.message || 'Erreur lors du chargement des utilisateurs')
                if (dataResponse.message && (dataResponse.message.includes('non autorisé') || dataResponse.message.includes('refusé'))) {
                    setTimeout(() => {
                        window.location.href = '/'
                    }, 2000)
                }
            }
        } catch (error) {
            console.error('Error fetching all users:', error)
            toast.error('Erreur de connexion. Vérifiez que le serveur backend est démarré.')
        }
    }

    const handleDeleteUser = async (userId, userName) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userName}" ?`)) {
            setLoading(prev => ({ ...prev, [userId]: true }))
            try {
                const response = await fetch(SummaryApi.deleteUser.url, {
                    method: SummaryApi.deleteUser.method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        userId: userId
                    })
                })

                const dataResponse = await response.json()

                if (dataResponse.success) {
                    toast.success('Utilisateur supprimé avec succès')
                    fetchAllUsers()
                } else {
                    toast.error(dataResponse.message)
                }
            } catch (error) {
                console.error('Error deleting user:', error)
                toast.error('Erreur lors de la suppression de l\'utilisateur')
            } finally {
                setLoading(prev => ({ ...prev, [userId]: false }))
            }
        }
    }

    useEffect(()=>{
        fetchAllUsers()
    },[])

  return (
    <div className='bg-white pb-4'>
        <table className='w-full userTable'>
            <thead>
                <tr className='bg-black text-white'>
                    <th>Sr.</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created Date</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody className=''>
                {
                    allUser.map((el,index) => {
                        return(
                            <tr key={el._id || index}>
                                <td>{index+1}</td>
                                <td>{el?.name}</td>
                                <td>{el?.email}</td>
                                <td>{el?.role}</td>
                                <td>{moment(el?.createdAt).format('LL')}</td>
                                <td>
                                    <div className='flex gap-2'>
                                        <button className='bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green-500 hover:text-white' 
                                        onClick={()=>{
                                            setUpdateUserDetails(el)
                                            setOpenUpdateRole(true)

                                        }}
                                        >
                                            <MdModeEdit/>
                                        </button>
                                        <button 
                                            className={`bg-red-100 p-2 rounded-full cursor-pointer hover:bg-red-500 hover:text-white ${loading[el._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            onClick={() => !loading[el._id] && handleDeleteUser(el._id, el.name)}
                                            disabled={loading[el._id]}
                                        >
                                            <MdDelete/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>

        {
            openUpdateRole && (
                <ChangeUserRole 
                    onClose={()=>setOpenUpdateRole(false)} 
                    name={updateUserDetails.name}
                    email={updateUserDetails.email}
                    role={updateUserDetails.role}
                    userId={updateUserDetails._id}
                    callFunc={fetchAllUsers}
                />
            )      
        }
    </div>
  )
}

export default AllUsers
