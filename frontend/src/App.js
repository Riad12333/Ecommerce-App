// removed unused logo import
import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCallback, useEffect, useState } from 'react';
import SummaryApi from './common';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';

function App() {
  const dispatch = useDispatch()
  const [cartProductCount, setCartProductCount] = useState(0)

  const fetchUserDetails = useCallback(async () => {
    try {
      const dataResponse = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        credentials: 'include'
      })

      if (!dataResponse.ok) {
        throw new Error(`HTTP error! status: ${dataResponse.status}`)
      }

      const dataApi = await dataResponse.json()

      if (dataApi.success) {
        dispatch(setUserDetails(dataApi.data))
      }
    } catch (error) {
      console.error('Error fetching user details:', error.message)
      // Backend might not be running, silently fail
    }
  }, [dispatch])

  const fetchUserAddToCart = useCallback(async () => {
    try {
      const dataResponse = await fetch(SummaryApi.addToCartProductCount.url, {
        method: SummaryApi.addToCartProductCount.method,
        credentials: 'include'
      })

      if (!dataResponse.ok) {
        throw new Error(`HTTP error! status: ${dataResponse.status}`)
      }

      const dataApi = await dataResponse.json()

      setCartProductCount(dataApi?.data?.count)
    } catch (error) {
      console.error('Error fetching cart count:', error.message)
      // Backend might not be running, silently fail
      setCartProductCount(0)
    }
  }, [])

  useEffect(() => {
    /**user Details */
    fetchUserDetails()
    /**user Details cart product */
    fetchUserAddToCart()

  }, [fetchUserDetails, fetchUserAddToCart])
  return (
    <>
      <Context.Provider value={{
        fetchUserDetails, // user detail fetch 
        cartProductCount, // current user add to cart product count,
        fetchUserAddToCart
      }}>
        <ToastContainer
          position='top-center'
        />

        <Header />
        <main className='min-h-[calc(100vh-120px)] pt-24 bg-background'>
          <Outlet />
        </main>
        <Footer />
      </Context.Provider>
    </>
  );
}

export default App;
