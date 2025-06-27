import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { BrowserRouter as Router, Navigate } from "react-router-dom";


import "./App.css";
import Header from "./components/header";
import AnimatedPage from "../src/components/ui/AnimatePage";
import { AnimatePresence } from "framer-motion";
import HeroSection from "./components/home/hero";
//import CategorySection from "./components/category";
import MainCategoriesSection from "./components/home/mainCategories";
import BrowseByCategory from "./components/home/BrowseByCategory";
import ProductTabsSection from "./components/home/productSelection";
import SplitTestimonialGallery from "./components/home/Testimonials";
import FinalCallToActionSection from "./components/home/FinalCallToAction";
import Footer from "./components/home/Footer";

import CatalogPage from "./components/SmartHome";
import ProductDetailPage from "./components/singleProduct";
import ShoppingCartPage from "./components/shopingCart";
import CheckoutStep1 from "./components/shippingStepOne";
import CheckoutStep2 from "./components/shippingStepTwo";
import CheckoutStep3 from "./components/shippingStepThree";

import ContactUs from "./components/contactUs/ContactUs";
import SmartHomePage from "./components/SmartHome";
import IndustrialDevices from "./components/IndustrialDevices";
import Wearables from "./components/Wearables";
import WearableDevices from "./components/Wearables";
import SmartCity from "./components/SmartCity";
import Modules from "./components/Modules";
import TrackingDevices from "./components/SmartTracking";
import Catalog from "./components/CatalogPage";
import AboutUsPage from "../src/pages/AboutUs";
import AuthModal from "./components/userAdmin/userSignUp";
{
  /* ChatGpt  
import AdminLayout from "./pages/admin/AdminLayout";
{/* ChatGpt  */
}
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import ProductsList from "./pages/products/ProductsList";
import AddProduct from "./pages/products/AddProduct";
import EditProduct from "./pages/products/EditProduct";

import OrdersList from "./pages/products/OrdersList";
import CustomersList from "./pages/products/CustomersList";

import Settings from "./pages/products/Settings";
// shoping cart

import AddressSelection from "./components/shoppingCart/AddressSelection";
import ShippingMethod from "./components/shoppingCart/ShippingMethod";
import PaymentMethod from "./components/shoppingCart/PaymentMethod";
import CheckoutFlow from "./components/shoppingCart/CheckoutFlow";
import OrderConfirmation from "./components/shoppingCart/OrderConfirmation";
//order details
import OrderDetails from "../src/pages/products/OrderDetails"; // adjust path as needed
import MyOrders from "./components/shoppingCart/MyOrders";
// admin dashboard
import PrivateRoute from "./pages/AdminDashBoard/PrivateRoute";
import AdminReviews from "./pages/products/AdminReviews";
import EditProductForm from "./components/products/EditProductForm";
import UserProfile from "./components/userAdmin/UserProfile";
import AllCategory from "./components/AllCategory";
const HomePage = () => (
  <AnimatedPage>
    <HeroSection />

    <MainCategoriesSection />
    <BrowseByCategory />
    <ProductTabsSection />
    <SplitTestimonialGallery />
    <FinalCallToActionSection />
  </AnimatedPage>
);

function App() {
  const location = useLocation();
  // for login/sign auth Modal
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Header onLoginClick={() => setShowModal(true)} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/products" element={<AllCategory />} />
          <Route path="/:categorySlug" element={<AllCategory />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/userSignUp" element={<AuthModal />} />
          <Route path="/checkout" element={<CheckoutFlow />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route
            path="/order-confirmation/:orderId"
            element={<OrderConfirmation />}
          />

          {/* ✅ Admin Dashboard (Protected Route) */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute>
                <AdminLayout />
              </PrivateRoute>
            }
          />

          {/* ✅ Nested Admin Pages inside AdminLayout */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductsList />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/edit/:id" element={<EditProductForm />} />
            <Route path="orders" element={<OrdersList />} />
            <Route path="reviews" element={<AdminReviews />} />

            <Route path="customers" element={<CustomersList />} />

            <Route path="settings" element={<Settings />} />
            <Route path="/admin/orders/:id" element={<OrderDetails />} />
            <Route path="/admin/products" element={<AdminLayout />}></Route>
          </Route>

          {/* Optional: Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <Footer />
    </>
  );
}

export default App;
