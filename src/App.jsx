import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginSignup from './Pages/LoginSignup'
import CustomerHome from './Pages/CustomerHome'
import MenuPage from './Pages/MenuPage'
import CartPage from './Pages/CartPage'
import Checkout from './Pages/Checkout'
import OrderConfirmation from './Pages/OrderConfirmation'
import AdminDashboard from './Pages/AdminDashboard'
import AdminMenuEditor from './Pages/AdminMenuEditor'
import AdminOrders from './Pages/AdminOrders'

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/'               element={<LoginSignup />} />
                    <Route path='/home'           element={<CustomerHome />} />
                    <Route path='/menu'           element={<MenuPage />} />
                    <Route path='/cart'           element={<CartPage />} />
                    <Route path='/checkout'       element={<Checkout />} />
                    <Route path='/order-confirm'  element={<OrderConfirmation />} />
                    <Route path='/admin'          element={<AdminDashboard />} />
                    <Route path='/admin/menu'     element={<AdminMenuEditor />} />
                    <Route path='/admin/orders'   element={<AdminOrders />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App