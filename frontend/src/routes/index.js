import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import Login from '../pages/Login'
import ForgotPassowrd from '../pages/ForgotPassowrd'
import SignUp from '../pages/SignUp'
import AdminPanel from '../pages/AdminPanel'
import AllUsers from '../pages/AllUsers'
import AllProducts from '../pages/AllProducts'
import Dashboard from '../pages/Dashboard'
import AllCarts from '../pages/AllCarts'
import CategoryProduct from '../pages/CategoryProduct'
import ProductDetails from '../pages/ProductDetails'
import Cart from '../pages/Cart'
import SearchProduct from '../pages/SearchProduct'
import Checkout from '../pages/Checkout'
import OrderSuccess from '../pages/OrderSuccess'
import Orders from '../pages/Orders'
import AllOrders from '../pages/AllOrders'

const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path : "",
                element : <Home/>
            },
            {
                path : "login",
                element : <Login/>
            },
            {
                path : "forgot-password",
                element : <ForgotPassowrd/>
            },
            {
                path : "sign-up",
                element : <SignUp/>
            },
            {
                path : "product-category",
                element : <CategoryProduct/>
            },
            {
                path : "product/:id",
                element : <ProductDetails/>
            },
            {
                path : 'cart',
                element : <Cart/>
            },
            {
                path : "search",
                element : <SearchProduct/>
            },
            {
                path : "checkout",
                element : <Checkout/>
            },
            {
                path : "order-success/:orderId",
                element : <OrderSuccess/>
            },
            {
                path : "orders",
                element : <Orders/>
            },
            {
                path : "admin-panel",
                element : <AdminPanel/>,
                children : [
                    {
                        index : true,
                        element : <Dashboard/>
                    },
                    {
                        path : "dashboard",
                        element : <Dashboard/>
                    },
                    {
                        path : "all-users",
                        element : <AllUsers/>
                    },
                    {
                        path : "all-products",
                        element : <AllProducts/>
                    },
                    {
                        path : "all-carts",
                        element : <AllCarts/>
                    },
                    {
                        path : "all-orders",
                        element : <AllOrders/>
                    }
                ]
            },
        ]
    }
])


export default router
