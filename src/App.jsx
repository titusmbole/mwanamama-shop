import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS
// import Notifications from "react-notify-toast";

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
// import RequireAdminAuth from "./components/RequireAdminAuth";

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Auth Components
// import AdminLogin from './pages/admin/AdminLogin';
// import AdminReg from './pages/admin/AdminReg';

// Public Pages
import Products from './pages/Products';
import Cart from './components/CartPage';
import Wishlist from './components/Wishlist';
import Checkout from './pages/Checkout';
import PaymentCompletion from './pages/PaymentCompletion';
import Orders from './components/MyOrders';
import AccountSettings from './components/AccountSetting';
import LoginForm from './components/LoginForm';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPass';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import OrdersAdmin from './pages/admin/Orders';
import ProductsAdmin from './pages/admin/ProductsAdmin';
import CategoriesAdmin from './pages/admin/Categories';
import Reports from './pages/admin/Reports';
import Customers from './pages/admin/Customers';
import Users from './pages/admin/Users';
import RolesComponent from './pages/admin/Roles';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <AdminAuthProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            {/* The ToastContainer is now active here */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
             {/* <Notifications /> */}
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Products />} />
                <Route path="products" element={<Products />} />
                <Route path="cart" element={<Cart />} />
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="payment-completion" element={<PaymentCompletion />} />
                <Route path="orders" element={<Orders />} />
                <Route path="account" element={<AccountSettings />} />
              </Route>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot" element={<ForgotPassword />} />

              {/* ADMIN LOGIN */}
              {/* <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin-reg" element={<AdminReg />} /> */}

              {/* PROTECTED ADMIN ROUTES */}
              <Route
                path="/admin/*"
                element={
                  // <RequireAdminAuth>
                    <AdminLayout />
                  // </RequireAdminAuth>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="orders" element={<OrdersAdmin />} />
                <Route path="products" element={<ProductsAdmin />} />
                <Route path="categories" element={<CategoriesAdmin />} />
                <Route path="customers" element={<Customers />} />
                <Route path="users" element={<Users />} />
                <Route path="roles" element={<RolesComponent />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
                
              </Route>

              {/* Not Found */}
              <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </AdminAuthProvider> 
  );
}

export default App;
