import "./App.css";

import React, { useState } from "react";

import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import AnimatedPage from "../src/components/ui/AnimatePage";
import AboutUsPage from "./components/AboutUs/AboutUsPage";
import AddProduct from "./components/AdminDashBoard/AddProduct";
import AdminLayout from "./components/AdminDashBoard/AdminLayout";
import AdminReviews from "./components/AdminDashBoard/AdminReviews";
import CustomersList from "./components/AdminDashBoard/CustomersList";
import Dashboard from "./components/AdminDashBoard/Dashboard";
import OrdersList from "./components/AdminDashBoard/OrdersList";
// admin dashboard
import PrivateRoute from "./components/AdminDashBoard/PrivateRoute";
import EditProductForm from "./components/AdminDashBoard/products/EditProductForm";
//order details
import OrderDetails from "./components/AdminDashBoard/products/OrderDetails"; // adjust path as needed
import ProductsList from "./components/AdminDashBoard/ProductsList";
import Settings from "./components/AdminDashBoard/Settings";
import AllCategory from "./components/Categories/AllCategory";
import SingleProductPage from "./components/Categories/SingleProductPage";
import ContactUs from "./components/contactUs/ContactUs";
import Header from "./components/header";
import BrowseByCategory from "./components/home/BrowseByCategory";
import FinalCallToActionSection from "./components/home/FinalCallToAction";
import Footer from "./components/home/Footer";
import HeroSection from "./components/home/HeroSection";
//import CategorySection from "./components/category";
import MainCategoriesSection from "./components/home/MainCategoriesSection";
import ProductTabsSection from "./components/home/ProductTabsSection";
import SplitTestimonialGallery from "./components/home/Testimonials";
import CheckoutFlow from "./components/shoppingCart/CheckoutFlow";
import MyOrders from "./components/shoppingCart/MyOrders";
import OrderConfirmation from "./components/shoppingCart/OrderConfirmation";
import UserProfile from "./components/userAdmin/UserProfile";
import AuthModal from "./components/userAdmin/userSignUp";

{
  /* ChatGpt  
import AdminLayout from "./pages/admin/AdminLayout";
{/* ChatGpt  */
}

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
          <Route path="/product/:id" element={<SingleProductPage />} />
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
