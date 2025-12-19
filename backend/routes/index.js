const express = require('express')

const router = express.Router()

const userSignUpController = require("../controller/user/userSignUp")
const userSignInController = require('../controller/user/userSignIn')
const userDetailsController = require('../controller/user/userDetails')
const authToken = require('../middleware/authToken')
const adminAuth = require('../middleware/adminAuth')
const userLogout = require('../controller/user/userLogout')
const allUsers = require('../controller/user/allUsers')
const updateUser = require('../controller/user/updateUser')
const UploadProductController = require('../controller/product/uploadProduct')
const getProductController = require('../controller/product/getProduct')
const updateProductController = require('../controller/product/updateProduct')
const getCategoryProduct = require('../controller/product/getCategoryProductOne')
const getCategoryWiseProduct = require('../controller/product/getCategoryWiseProduct')
const getProductDetails = require('../controller/product/getProductDetails')
const addToCartController = require('../controller/user/addToCartController')
const countAddToCartProduct = require('../controller/user/countAddToCartProduct')
const addToCartViewProduct  = require('../controller/user/addToCartViewProduct')
const updateAddToCartProduct = require('../controller/user/updateAddToCartProduct')
const deleteAddToCartProduct = require('../controller/user/deleteAddToCartProduct')
const searchProduct = require('../controller/product/searchProduct')
const filterProductController = require('../controller/product/filterProduct')
const deleteProductController = require('../controller/product/deleteProduct')
const deleteUserController = require('../controller/user/deleteUser')
const dashboardStats = require('../controller/admin/dashboardStats')
const allCartsController = require('../controller/admin/allCarts')
const allOrdersController = require('../controller/admin/allOrders')
const createOrderController = require('../controller/order/createOrder')
const getUserOrdersController = require('../controller/order/getUserOrders')
const updateOrderStatusController = require('../controller/order/updateOrderStatus')



router.post("/signup",userSignUpController)
router.post("/signin",userSignInController)
router.get("/user-details",authToken,userDetailsController)
router.get("/userLogout",userLogout)

//admin panel 
router.get("/all-user",authToken,adminAuth,allUsers)
router.post("/update-user",authToken,adminAuth,updateUser)
router.post("/delete-user",authToken,adminAuth,deleteUserController)
router.get("/dashboard-stats",authToken,adminAuth,dashboardStats)
router.get("/all-carts",authToken,adminAuth,allCartsController)
router.get("/all-orders",authToken,adminAuth,allOrdersController)
router.post("/update-order-status",authToken,adminAuth,updateOrderStatusController)

//product
router.post("/upload-product",authToken,adminAuth,UploadProductController)
router.get("/get-product",getProductController)
router.post("/update-product",authToken,adminAuth,updateProductController)
router.post("/delete-product",authToken,adminAuth,deleteProductController)
router.get("/get-categoryProduct",getCategoryProduct)
router.post("/category-product",getCategoryWiseProduct)
router.post("/product-details",getProductDetails)
router.get("/search",searchProduct)
router.post("/filter-product",filterProductController)

//user add to cart
router.post("/addtocart",authToken,addToCartController)
router.get("/countAddToCartProduct",authToken,countAddToCartProduct)
router.get("/view-card-product",authToken,addToCartViewProduct)
router.post("/update-cart-product",authToken,updateAddToCartProduct)
router.post("/delete-cart-product",authToken,deleteAddToCartProduct)

//orders
router.post("/create-order",authToken,createOrderController)
router.get("/user-orders",authToken,getUserOrdersController)







module.exports = router