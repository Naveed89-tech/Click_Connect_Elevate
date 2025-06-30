import React from "react";

import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"; // Using lucide-react icons
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-black text-gray-300 pt-16 pb-10 px-6 md:px-16">
      {/* TOP FOOTER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
        {/* Company Info */}
        <div className="flex flex-col items-start">
          <Link
            to="#"
            onClick={() =>
              window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
            }
            className="flex items-center gap-8 w-full sm:w-auto sm:flex-1"
          >
            <img
              src="https://github.com/Naveed89-tech/Click-Connect-Images/blob/main/logo_dark_white.png?raw=true"
              alt="Store Logo"
              className="h-18 object-contain justify-self-start"
            />
          </Link>
          <p className="text-white opacity-70 text-[16px] leading-relaxed mt-[20px] font-Roboto ">
            Empowering smart living through intelligent devices. Your connected
            future starts here.
          </p>
        </div>

        {/* Quick Links */}
        <div className="mr-[24px] font-Roboto">
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-[16px] text-white opacity-70">
            <li>
              <Link to="/products" className="hover:text-secondary  ">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/about-us" className="hover:text-secondary ">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact-us" className="hover:text-secondary ">
                Support
              </Link>
            </li>
            <li>
              <Link to="/contact-us" className="hover:text-secondary ">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div className="font-Roboto">
          <h4 className="text-white font-semibold mb-4 font-Roboto">
            Categories
          </h4>
          <ul className="space-y-2 text-[16px] text-white opacity-70">
            <li>
              <Link to="/smart-home" className="hover:text-secondary">
                Smart Homes
              </Link>
            </li>
            <li>
              <Link to="/wearables" href="#" className="hover:text-secondary">
                Wearables
              </Link>
            </li>
            <li>
              <Link to="/industrial-iot" className="hover:text-secondary">
                Industrial IoT
              </Link>
            </li>
            <li>
              <Link to="/smart-city" className="hover:text-secondary">
                Smart City
              </Link>
            </li>
          </ul>
        </div>

        {/* App Download */}
        <div>
          <h4 className="text-white font-semibold font-Roboto mb-4">
            Get Our App
          </h4>
          <div className="flex flex-col gap-3">
            <a href="#">
              <img
                src="https://github.com/Naveed89-tech/Click-Connect-Images/blob/main/appStore.png?raw=true"
                alt="Apple Logo"
                width="100"
                className="h-10 w-auto"
              />
            </a>
            <a href="#">
              <img
                src="https://github.com/Naveed89-tech/Click-Connect-Images/blob/main/playstore.jpg?raw=true"
                alt="Play Store"
                className="h-10 w-auto"
              />
            </a>
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTER */}
      <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-white opacity-70 leading-relaxed font-Montserrat">
          © 2025 Connect Automate & Elevate. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white">
            <Facebook size={18} />
          </a>
          <a href="#" className="hover:text-white">
            <Twitter size={18} />
          </a>
          <a href="#" className="hover:text-white">
            <Linkedin size={18} />
          </a>
          <a href="#" className="hover:text-white">
            <Instagram size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
