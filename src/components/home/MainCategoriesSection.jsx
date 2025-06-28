import { Link } from "react-router-dom";

import Button from "../ui/button";

function MainCategoriesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 py-12 sm:py-16 font-Roboto">
      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 sm:mb-4">
          Explore Our Smart Solutions
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2 xs:px-0">
          Cutting-edge IoT products designed to simplify and enhance your daily
          life
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Left Column */}
        <div className="space-y-6 sm:space-y-8">
          {/* Featured Product Card */}
          <div className="group relative flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-full md:w-1/2 h-48 sm:h-auto overflow-hidden flex-shrink-0">
              <img
                src={
                  "https://github.com/Naveed89-tech/Click-Connect-Images/blob/main/products/hero_device_new.png?raw=true"
                }
                alt="Smart Homes"
                className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
              />
            </div>
            <div className="p-6 sm:p-8 md:w-1/2 flex flex-col justify-center font-Roboto">
              <span className="w-fit  inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mb-3">
                Featured
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-primary mb-3">
                Smart Home Ecosystem
              </h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-[15px] sm:text-[16px]">
                Transform your living space with our intelligent home solutions
                that adapt to your lifestyle.
              </p>
              <div className="mt-auto">
                <Link
                  to="/smart-homes"
                  className="inline-flex items-center text-secondary font-Rubik font-medium group"
                >
                  Discover more
                  <svg
                    className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Two Small Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* IoT Modules Card */}
            <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <div className="p-5 sm:p-6 flex flex-col h-full">
                <div className="flex justify-center mb-4 sm:mb-6">
                  <img
                    src={
                      "https://github.com/Naveed89-tech/Click-Connect-Images/blob/main/Gallery/10.jpg?raw=true"
                    }
                    alt="IoT Modules"
                    className="h-32 sm:h-40 object-contain transform group-hover:scale-110 transition duration-500"
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  IoT Modules & Devices
                </h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                  Customizable solutions for your connected environment.
                </p>
                <div className="mt-auto">
                  <Button
                    variant="outline"
                    className="w-full hover:cursor-pointer border-secondary text-secondary hover:bg-secondary font-Rubik hover:text-white text-sm sm:text-base"
                  >
                    View Products
                  </Button>
                </div>
              </div>
            </div>

            {/* IoT Monitoring Pro Card */}
            <div className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <div className="p-5 sm:p-6 flex flex-col h-full">
                <div className="flex justify-center mb-4 sm:mb-6">
                  <img
                    src={
                      "https://github.com/Naveed89-tech/Click-Connect-Images/blob/main/featured_one.png?raw=true"
                    }
                    alt="IoT Monitoring Pro"
                    className="h-32 sm:h-40 object-contain transform group-hover:scale-110 transition duration-500"
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
                  IoT Monitoring Pro
                </h3>
                <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
                  Advanced analytics for your connected devices.
                </p>
                <div className="mt-auto">
                  <Button
                    variant="solid"
                    className="w-full bg-secondary text-white font-Roboto cursor-pointer text-sm sm:text-base"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - IoT Tracker */}
        <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col lg:flex-row h-full">
            <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
              <span className="w-fit inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full mb-3">
                New Arrival
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                IoT Tracker Pro
              </h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Real-time tracking for your valuable assets with geofencing and
                instant alerts.
              </p>
              <ul className="space-y-2 mb-6 sm:mb-8">
                <li className="flex items-center">
                  <svg
                    className="w-4 sm:w-5 h-4 sm:h-5 text-secondary mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700 text-sm sm:text-base">
                    Global coverage
                  </span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 sm:w-5 h-4 sm:h-5 text-secondary mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700 text-sm sm:text-base">
                    Long battery life
                  </span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 sm:w-5 h-4 sm:h-5 text-secondary mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700 text-sm sm:text-base">
                    Water resistant
                  </span>
                </li>
              </ul>
              <div className="flex space-x-3 sm:space-x-4">
                <Link to="/products/iot-tracker" className="flex-1">
                  <Button
                    variant="solid"
                    className="w-full bg-primary text-white cursor-pointer font-Rubik text-sm sm:text-base"
                  >
                    Shop Now
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-8 bg-gray-50">
              <img
                src={
                  "https://github.com/Naveed89-tech/Click-Connect-Images/blob/main/newImage.png?raw=true"
                }
                alt="IoT Tracker"
                className="max-h-64 sm:max-h-80 object-contain transform group-hover:scale-105 transition duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MainCategoriesSection;
