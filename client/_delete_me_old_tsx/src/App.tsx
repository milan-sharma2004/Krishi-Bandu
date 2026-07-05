import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

import FarmerLayout from './layouts/FarmerLayout';
import FarmerDashboard from './pages/farmer/Dashboard';
import FarmerCrops from './pages/farmer/Crops';
import FarmerWeather from './pages/farmer/Weather';
import FarmerMarketPrices from './pages/farmer/MarketPrices';
import FarmerAdvisories from './pages/farmer/Advisories';
import FarmerServices from './pages/farmer/Services';
import FarmerShops from './pages/farmer/Shops';
import FarmerProducts from './pages/farmer/MyProducts';
import FarmerSupport from './pages/farmer/Support';

import BuyerLayout from './layouts/BuyerLayout';
import BuyerHome from './pages/buyer/Home';
import BuyerBrowse from './pages/buyer/Browse';
import BuyerProductDetail from './pages/buyer/ProductDetail';
import BuyerCart from './pages/buyer/Cart';
import BuyerOrders from './pages/buyer/Orders';
import BuyerOrderDetail from './pages/buyer/OrderDetail';
import BuyerProfile from './pages/buyer/Profile';

import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminServices from './pages/admin/Services';
import AdminShops from './pages/admin/Shops';
import AdminReports from './pages/admin/Reports';
import AdminAdvisories from './pages/admin/Advisories';
import AdminSettings from './pages/admin/Settings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/farmer"
        element={
          <ProtectedRoute roles={['farmer']}>
            <FarmerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<FarmerDashboard />} />
        <Route path="crops" element={<FarmerCrops />} />
        <Route path="weather" element={<FarmerWeather />} />
        <Route path="market-prices" element={<FarmerMarketPrices />} />
        <Route path="advisories" element={<FarmerAdvisories />} />
        <Route path="services" element={<FarmerServices />} />
        <Route path="shops" element={<FarmerShops />} />
        <Route path="products" element={<FarmerProducts />} />
        <Route path="support" element={<FarmerSupport />} />
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
        <Route path="cart" element={<BuyerCart />} />
        <Route path="orders" element={<BuyerOrders />} />
        <Route path="orders/:id" element={<BuyerOrderDetail />} />
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
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="shops" element={<AdminShops />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="advisories" element={<AdminAdvisories />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<Landing />} />
    </Routes>
  );
}

export default App;
