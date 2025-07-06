import {
  Check,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import Button from '../../components/ui/button';

function FinalCallToActionSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white py-16 md:py-24">
      <div className=" font-Roboto max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-blue-100 opacity-20 blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute left-0 bottom-0 w-96 h-96 rounded-full bg-indigo-100 opacity-10 blur-3xl -ml-20"></div>

        {/* LEFT COLUMN - CONTENT */}
        <div className="relative z-10 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#fff6e7] rounded-full">
            <Zap className="w-5 h-5 text-secondary" fill="currentColor" />
            <span className="text-[12px] xs:text-sm font-medium text-secondary uppercase tracking-wider">
              Limited Time Offer
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl xs:text-3xl   sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Get Your First{" "}
            <span className="text-secondary font-Montserrat">Smart Device</span>{" "}
            With Free Installation
          </h1>

          {/* Description */}
          <p className="text-sm xs:text-lg text-gray-600 max-w-lg">
            Experience seamless automation with our premium IoT devices.
            Professional setup included at no extra cost.
          </p>

          {/* Benefits List */}
          <ul className="space-y-3 text-sm xs:text-lg">
            {[
              "No-hassle professional installation",
              "30-day money-back guarantee",
              "24/7 customer support",
              "Works with all major smart home platforms",
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <Check className="w-5 h-5 text-secondary mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-between ">
            <Link to="/products" className="flex-1 min-w-[200px]">
              <Button
                variant="primary"
                className="py-4 text-lg flex items-left justify-center gap-2  transition-all"
              >
                Shop Now
              </Button>
            </Link>
          </div>

          {/* Ratings */}
          <div className="flex items-center gap-2 text-sm text-gray-500 pt-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[12px]  sm:text-base">
              Rated 4.9/5 by 2,400+ customers
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN - PRODUCT IMAGE */}
        <div className="relative z-10 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md">
            <img
              src="https://github.com/Naveed89-tech/Click-Connect-Images/blob/main/final_button.png?raw=true"
              alt="Premium Smart Device"
              className="w-full h-auto object-contain transform hover:scale-105 transition duration-500"
            />
            {/* Price Tag */}
            <div className="absolute -bottom-4 -right-4 bg-white px-5 py-3 rounded-xl shadow-lg border border-gray-100">
              <div className="text-sm text-gray-500">Starting at</div>
              <div className="text-2xl font-bold text-gray-900">
                $149<span className="text-base font-normal">.99</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FinalCallToActionSection;
