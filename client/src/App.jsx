import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Landing from './pages/public/Landing.jsx';
import Login from './pages/public/Login.jsx';
import Register from './pages/public/Register.jsx';
import PrivacyPolicy from './pages/public/PrivacyPolicy.jsx';

import FarmerLayout from './layouts/FarmerLayout.jsx';
import FarmerDashboard from './pages/farmer/Dashboard.jsx';
import FarmerSellerDashboard from './pages/farmer/SellerDashboard.jsx';
import FarmerCrops from './pages/farmer/Crops.jsx';
import FarmerWeather from './pages/farmer/Weather.jsx';
import FarmerMarketPrices from './pages/farmer/MarketPrices.jsx';
import FarmerAdvisories from './pages/farmer/Advisories.jsx';
import FarmerServices from './pages/farmer/Services.jsx';
import FarmerShops from './pages/farmer/Shops.jsx';
import FarmerProducts from './pages/farmer/MyProducts.jsx';
import FarmerOrders from './pages/farmer/Orders.jsx';
import FarmerOrderDetail from './pages/farmer/OrderDetail.jsx';
import FarmerSupport from './pages/farmer/Support.jsx';
import FarmerProfile from './pages/farmer/Profile.jsx';
import Complaints from './pages/shared/Complaints.jsx';

import BuyerLayout from './layouts/BuyerLayout.jsx';
import BuyerHome from './pages/buyer/Home.jsx';
import BuyerBrowse from './pages/buyer/Browse.jsx';
import BuyerProductDetail from './pages/buyer/ProductDetail.jsx';
import BuyerSellerShop from './pages/buyer/SellerShop.jsx';
import BuyerCart from './pages/buyer/Cart.jsx';
import BuyerOrders from './pages/buyer/Orders.jsx';
import BuyerOrderDetail from './pages/buyer/OrderDetail.jsx';
import BuyerProfile from './pages/buyer/Profile.jsx';

import AdminLayout from './layouts/AdminLayout.jsx';
import AdminDashboard from './pages/admin/Dashboard.jsx';
import AdminUsers from './pages/admin/Users.jsx';
import AdminActivityLog from './pages/admin/ActivityLog.jsx';
import AdminProducts from './pages/admin/Products.jsx';
import AdminOrders from './pages/admin/Orders.jsx';
import AdminServices from './pages/admin/Services.jsx';
import AdminShops from './pages/admin/Shops.jsx';
import AdminReports from './pages/admin/Reports.jsx';
import AdminAdvisories from './pages/admin/Advisories.jsx';
import AdminSettings from './pages/admin/Settings.jsx';
import AdminComplaints from './pages/admin/Complaints.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />

      <Route
        path="/farmer"
        element={
          <ProtectedRoute roles={['farmer']}>
            <FarmerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<FarmerDashboard />} />
        <Route path="seller-dashboard" element={<FarmerSellerDashboard />} />
        <Route path="crops" element={<FarmerCrops />} />
        <Route path="weather" element={<FarmerWeather />} />
        <Route path="market-prices" element={<FarmerMarketPrices />} />
        <Route path="advisories" element={<FarmerAdvisories />} />
        <Route path="services" element={<FarmerServices />} />
        <Route path="shops" element={<FarmerShops />} />
        <Route path="products" element={<FarmerProducts />} />
        <Route path="orders" element={<FarmerOrders />} />
        <Route path="orders/:id" element={<FarmerOrderDetail />} />
        <Route path="support" element={<FarmerSupport />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="profile" element={<FarmerProfile />} />
      </Route>

      <Route
        path="/buyer"
        element={
          <ProtectedRoute roles={['buyer']}>
            <BuyerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<BuyerHome />} />
        <Route path="browse" element={<BuyerBrowse />} />
        <Route path="products/:id" element={<BuyerProductDetail />} />
        <Route path="sellers/:id" element={<BuyerSellerShop />} />
        <Route path="cart" element={<BuyerCart />} />
        <Route path="orders" element={<BuyerOrders />} />
        <Route path="orders/:id" element={<BuyerOrderDetail />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="profile" element={<BuyerProfile />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="activity-log" element={<AdminActivityLog />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="shops" element={<AdminShops />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="advisories" element={<AdminAdvisories />} />
        <Route path="complaints" element={<AdminComplaints />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<Landing />} />
    </Routes>
  );
}

export default App;
