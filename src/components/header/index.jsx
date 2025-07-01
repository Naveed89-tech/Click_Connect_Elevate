import React, { useEffect, useRef, useState } from "react";

import { AiOutlineShoppingCart } from "react-icons/ai";
import {
  FaChevronDown,
  FaRegHeart,
  FaSignOutAlt,
  FaUser,
  FaUserEdit,
} from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { MdOnDeviceTraining } from "react-icons/md";
import { SiHomeassistant } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";

import CartSidebar from "../../components/shoppingCart/CartSidebar";
import WishlistSidebar from "../../components/shoppingCart/WishlistSidebar";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import CategoryStrip from "./CategoryStrip";

const Header = ({ onLoginClick }) => {
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownTimeout = useRef(null);
  const userDropdownTimeout = useRef(null);
  const adminDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const isAdmin = user?.email === "naveed5651@gmail.com";

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      clearTimeout(dropdownTimeout.current);
      clearTimeout(userDropdownTimeout.current);
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        adminDropdownRef.current &&
        !adminDropdownRef.current.contains(event.target)
      ) {
        setAdminDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-button")
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="w-full bg-white shadow-md font-Rubik sticky top-0 z-50">
        <div className="px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <Link to={"/"} className="flex items-center">
              <img
                src="https://github.com/Naveed89-tech/Click-Connect-Images/blob/main/logo_orig.png?raw=true"
                alt="Store Logo"
                className="h-17 sm:h-14 object-contain"
              />
            </Link>

            {/* Mobile menu button */}
            <button
              className="sm:hidden text-gray-700 mobile-menu-button p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex gap-4 lg:gap-6 text-gray-700 text-base lg:text-[1.25rem] font-Rubik">
            <Link to="/" className="hover:text-secondary transition py-2">
              Home
            </Link>
            <Link
              to="/about-us"
              className="hover:text-secondary transition py-2"
            >
              About
            </Link>
            <Link
              to="/contact-us"
              className="hover:text-secondary transition py-2"
            >
              Contact Us
            </Link>
          </nav>

          <div className="flex items-center gap-3 sm:gap-4 text-gray-600 text-xl relative">
            {/* Wishlist Icon */}
            <div className="relative group">
              <FaRegHeart
                className="cursor-pointer text-gray-500 hover:text-secondary/50 transition-colors text-lg sm:text-xl"
                title="Wishlist"
                onClick={() => setIsWishlistOpen(true)}
                aria-label="Wishlist"
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
              <span className="absolute hidden group-hover:block -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Wishlist
              </span>
            </div>

            {/* Cart Icon */}
            <div className="relative group">
              <AiOutlineShoppingCart
                className="cursor-pointer hover:text-secondary transition-colors text-xl sm:text-[24px]"
                title="Cart"
                onClick={() => setIsCartOpen(true)}
                aria-label="Cart"
              />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
              <span className="absolute hidden group-hover:block -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Cart
              </span>
            </div>

            {/* User Section */}
            {user ? (
              <div
                className="flex items-center gap-2 sm:gap-3 relative"
                ref={userDropdownRef}
                onMouseEnter={() => {
                  clearTimeout(userDropdownTimeout.current);
                  setUserDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  userDropdownTimeout.current = setTimeout(() => {
                    setUserDropdownOpen(false);
                  }, 300);
                }}
              >
                <div className="flex items-center gap-1 sm:gap-2 cursor-pointer group">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User"
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-transparent group-hover:border-secondary transition-all"
                    />
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center border-2 border-transparent group-hover:border-secondary transition-all">
                      <FaUser className="text-gray-600 text-sm sm:text-base" />
                    </div>
                  )}
                  <span className="text-xs sm:text-sm font-medium">
                    {user.displayName || user.email.split("@")[0]}
                  </span>
                  <FaChevronDown
                    className={`text-xs transition-transform ${
                      userDropdownOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </div>

                {/* User Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 top-full bg-white shadow-lg rounded-md mt-1 w-48 z-50 border border-gray-100"
                    onMouseEnter={() => {
                      clearTimeout(userDropdownTimeout.current);
                      setUserDropdownOpen(true);
                    }}
                    onMouseLeave={() => {
                      userDropdownTimeout.current = setTimeout(() => {
                        setUserDropdownOpen(false);
                      }, 300);
                    }}
                  >
                    {!isAdmin && (
                      <>
                        <Link
                          to="/my-orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 transition-colors"
                        >
                          <MdOnDeviceTraining className="text-blue-500" />
                          <span>My Orders</span>
                        </Link>
                        <Link
                          to="/profile?redirectTo=profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 transition-colors"
                        >
                          <FaUserEdit className="text-green-500" />
                          <span>Edit Profile</span>
                        </Link>
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            handleLogout();
                          }}
                          className="block w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                        >
                          <FaSignOutAlt />
                          <span>Logout</span>
                        </button>
                      </>
                    )}

                    {isAdmin && (
                      <div
                        className="relative"
                        ref={adminDropdownRef}
                        onMouseEnter={() => {
                          clearTimeout(dropdownTimeout.current);
                          setAdminDropdownOpen(true);
                          setUserDropdownOpen(true);
                        }}
                        onMouseLeave={(e) => {
                          const dropdown =
                            adminDropdownRef.current?.querySelector(
                              ".admin-dropdown"
                            );
                          if (
                            !dropdown ||
                            !dropdown.contains(e.relatedTarget)
                          ) {
                            dropdownTimeout.current = setTimeout(() => {
                              setAdminDropdownOpen(false);
                            }, 600);
                          }
                        }}
                      >
                        <div className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded hover:bg-gray-100 transition-colors">
                          <span className="text-sm font-medium">Admin</span>
                          <FaChevronDown
                            className={`text-xs text-gray-500 transition-transform ${
                              adminDropdownOpen ? "transform rotate-180" : ""
                            }`}
                          />
                        </div>

                        {adminDropdownOpen && (
                          <div
                            className="admin-dropdown absolute right-0 top-full bg-white shadow-lg rounded-md mt-1 w-48 z-100 border border-gray-100"
                            onMouseEnter={() => {
                              clearTimeout(dropdownTimeout.current);
                              setAdminDropdownOpen(true);
                              setUserDropdownOpen(true);
                            }}
                            onMouseLeave={() => {
                              dropdownTimeout.current = setTimeout(() => {
                                setAdminDropdownOpen(false);
                              }, 500);
                            }}
                          >
                            <button
                              onClick={() => navigate("/admin")}
                              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 transition-colors"
                            >
                              <SiHomeassistant className="text-purple-500" />
                              <span>Dashboard</span>
                            </button>
                            <button
                              onClick={handleLogout}
                              className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                            >
                              <FaSignOutAlt />
                              <span>Logout</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center gap-1 cursor-pointer hover:text-secondary transition-colors group relative"
                aria-label="Login/Sign Up"
              >
                <FaUser className="text-lg sm:text-xl" />
                <span className="hidden sm:inline text-sm">Login</span>
                <span className="absolute hidden group-hover:block -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  Login/Sign Up
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="sm:hidden bg-white px-4 py-3 border-t border-gray-200"
          >
            <nav className="flex flex-col gap-3 text-gray-700 text-base font-Rubik">
              <Link
                to="/"
                className="hover:text-secondary transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about-us"
                className="hover:text-secondary transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact-us"
                className="hover:text-secondary transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
              {!user && (
                <button
                  onClick={() => {
                    onLoginClick();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-left hover:text-secondary transition-colors mt-2 py-2"
                >
                  <FaUser className="text-lg" />
                  <span>Login/Sign Up</span>
                </button>
              )}
            </nav>
          </div>
        )}

        <CategoryStrip />
      </header>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WishlistSidebar
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
    </>
  );
};

export default Header;
