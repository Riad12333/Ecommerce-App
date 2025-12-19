import React, { useContext, useState, useEffect, useRef } from 'react'
import Logo from './Logo'
import { GrSearch } from "react-icons/gr";
import { FaRegUserCircle } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify'
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';

const Header = () => {
  const user = useSelector(state => state?.user?.user)
  const dispatch = useDispatch()
  const [menuDisplay, setMenuDisplay] = useState(false)
  const context = useContext(Context)
  const navigate = useNavigate()
  const searchInput = useLocation()
  const URLSearch = new URLSearchParams(searchInput?.search)
  const searchQuery = URLSearch.getAll("q")
  const [search, setSearch] = useState(searchQuery)
  const menuRef = useRef(null)

  // Fermer le menu quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuDisplay(false)
      }
    }

    if (menuDisplay) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuDisplay])

  const handleLogout = async () => {
    try {
      const fetchData = await fetch(SummaryApi.logout_user.url, {
        method: SummaryApi.logout_user.method,
        credentials: 'include'
      })

      if (!fetchData.ok) {
        throw new Error(`HTTP error! status: ${fetchData.status}`)
      }

      const data = await fetchData.json()

      if (data.success) {
        toast.success(data.message)
        dispatch(setUserDetails(null))
        // Réinitialiser le compteur du panier lors de la déconnexion
        context.fetchUserAddToCart()
        navigate("/")
      } else if (data.error) {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error during logout:', error.message)
      toast.error('Erreur lors de la déconnexion')
    }
  }

  const handleSearch = (e) => {
    const { value } = e.target
    setSearch(value)

    if (value) {
      navigate(`/search?q=${value}`)
    } else {
      navigate("/search")
    }
  }
  return (
    <header className='h-20 shadow-soft bg-white fixed w-full z-40 transition-all font-body'>
      <div className='h-full container mx-auto flex items-center px-4 md:px-8 justify-between'>
        {/* Logo */}
        <div className='flex-shrink-0'>
          <Link to={"/"} className="flex items-center gap-2">
            <Logo w={100} h={55} />
          </Link>
        </div>

        {/* Search Bar */}
        <div className='hidden lg:flex items-center w-full justify-between max-w-lg border border-gray-200 rounded-lg focus-within:shadow-md focus-within:border-primary pl-4 py-1.5 transition-all bg-background'>
          <input type='text' placeholder='Search product here...' className='w-full outline-none bg-transparent text-text-main placeholder-text-secondary font-medium' onChange={handleSearch} value={search} />
          <div className='text-lg min-w-[50px] h-9 bg-primary flex items-center justify-center rounded-lg text-white hover:bg-primary-light cursor-pointer md:mx-1 transition-colors'>
            <GrSearch />
          </div>
        </div>

        {/* User Actions */}
        <div className='flex items-center gap-6'>

          <div className='relative flex justify-center items-center' ref={menuRef}>
            {
              user?._id && (
                <div className='text-3xl cursor-pointer relative flex justify-center hover:scale-105 transition-transform' onClick={() => setMenuDisplay(preve => !preve)}>
                  {
                    user?.profilePic ? (
                      <img src={user?.profilePic} className='w-10 h-10 rounded-full border-2 border-primary object-cover' alt={user?.name} />
                    ) : (
                      <FaRegUserCircle className="text-text-secondary hover:text-primary transition-colors" />
                    )
                  }
                </div>
              )
            }

            {
              menuDisplay && (
                <div className='absolute bg-white right-0 top-14 min-w-[200px] shadow-hover rounded-xl border border-gray-100 z-50 overflow-hidden animate-fade-in-up origin-top-right' >
                  <nav className='flex flex-col text-text-main font-medium'>
                    <div className='px-4 py-3 border-b border-gray-100 bg-background/50'>
                      <p className='font-heading font-semibold text-sm capitalize text-primary'>{user?.name || 'User'}</p>
                      <p className='text-xs text-text-secondary truncate'>{user?.email}</p>
                    </div>
                    {
                      user?.role === ROLE.ADMIN && (
                        <Link
                          to={"/admin-panel"}
                          className='whitespace-nowrap hover:bg-background hover:text-primary px-4 py-2.5 text-sm transition-colors flex items-center gap-2'
                          onClick={() => setMenuDisplay(false)}
                        >
                          Admin Panel
                        </Link>
                      )
                    }
                    <Link
                      to={"/cart"}
                      className='whitespace-nowrap hover:bg-background hover:text-primary px-4 py-2.5 text-sm transition-colors'
                      onClick={() => setMenuDisplay(false)}
                    >
                      My Cart
                    </Link>
                    <Link
                      to={"/orders"}
                      className='whitespace-nowrap hover:bg-background hover:text-primary px-4 py-2.5 text-sm transition-colors'
                      onClick={() => setMenuDisplay(false)}
                    >
                      My Orders
                    </Link>
                  </nav>
                </div>
              )
            }
          </div>

          {
            user?._id && (
              <Link to={"/cart"} className='relative group'>
                <span className="text-2xl text-text-secondary group-hover:text-primary transition-colors"><FaShoppingCart /></span>
                <div className='bg-secondary text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3 text-xs font-bold shadow-sm group-hover:scale-110 transition-transform'>
                  <p>{context?.cartProductCount}</p>
                </div>
              </Link>
            )
          }

          <div>
            {
              user?._id ? (
                <button onClick={handleLogout} className='px-5 py-2 rounded-lg text-white bg-primary hover:bg-primary-light transition-all shadow-soft hover:shadow-hover font-semibold text-sm tracking-wide'>Logout</button>
              )
                : (
                  <Link to={"/login"} className='px-6 py-2.5 rounded-lg text-white bg-primary hover:bg-primary-light transition-all shadow-soft hover:shadow-hover font-medium text-sm'>Login</Link>
                )
            }
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
