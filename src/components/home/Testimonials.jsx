import React, { useRef } from "react";

import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../ui/button";

const testimonials = [
  {
    name: "Amina Tariq",
    title: "Smart Home Owner",
    feedback:
      "I can't imagine going back to a non-smart home. Everything is just effortless with their ecosystem.",
    image: "https://randomuser.me/api/portraits/women/47.jpg",
    rating: 5,
    date: "2 weeks ago",
  },
  {
    name: "Usman Ali",
    title: "IoT Developer",
    feedback:
      "Reliable, efficient, and easy to integrate with my custom solutions. The API documentation is excellent.",
    image: "https://randomuser.me/api/portraits/men/48.jpg",
    rating: 4,
    date: "1 month ago",
  },
  {
    name: "Sana Mir",
    title: "Tech Enthusiast",
    feedback:
      "From smart wearables to tracking devices, their products never disappoint. The mobile app is particularly intuitive.",
    image: "https://randomuser.me/api/portraits/women/49.jpg",
    rating: 5,
    date: "3 days ago",
  },
  {
    name: "Bilal Khan",
    title: "City Planner",
    feedback:
      "Perfect for smart city implementations. Scalable and dependable hardware with excellent support.",
    image: "https://randomuser.me/api/portraits/men/50.jpg",
    rating: 5,
    date: "2 months ago",
  },
];

const productImages = [
  {
    src: "https://github.com/Naveed89-tech/Click-Connect-Images/blob/main/Gallery/1.jpg?raw=true",
    alt: "Smart home controller",
  },
  {
    src: "https://github.com/Naveed89-tech/Click-Connect-Images/blob/main/Gallery/2.jpg?raw=true",
    alt: "IoT security camera",
  },
  {
    src: "https://github.com/Naveed89-tech/Click-Connect-Images/blob/main/Gallery/3.jpg?raw=true",
    alt: "Smart lighting system",
  },
  {
    src: "https://github.com/Naveed89-tech/Click-Connect-Images/blob/main/Gallery/4.jpg?raw=true",
    alt: "Wireless sensors",
  },
  {
    src: "https://github.com/Naveed89-tech/Click-Connect-Images/blob/main/Gallery/5.jpg?raw=true",
    alt: "Smart thermostat",
  },
  {
    src: "https://github.com/Naveed89-tech/Click-Connect-Images/blob/main/Gallery/6.jpg?raw=true",
    alt: "Home automation hub",
  },
  {
    src: "https://github.com/Naveed89-tech/Click-Connect-Images/blob/main/Gallery/7.jpg?raw=true",
    alt: "Smart door lock",
  },
  {
    src: "https://github.com/Naveed89-tech/Click-Connect-Images/blob/main/Gallery/8.jpg?raw=true",
    alt: "Voice assistant",
  },
  {
    src: "https://github.com/Naveed89-tech/Click-Connect-Images/blob/main/Gallery/9.jpg?raw=true",
    alt: "Energy monitor",
  },
  {
    src: "https://github.com/Naveed89-tech/Click-Connect-Images/blob/main/Gallery/4.jpg?raw=true",
    alt: "Wireless sensors",
  },
];

function Testimonials() {
  const scrollContainer = useRef(null);

  const scrollLeft = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24 bg-white font-Roboto">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
        {/* Testimonials Section */}
        <div className="w-full lg:w-1/2">
          <div className="mb-2 flex items-center gap-2">
            <div className="w-4 h-0.5 bg-secondary"></div>
            <span className="text-sm font-medium tracking-wider text-secondary uppercase font-Montserrat">
              Customer Stories
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4 sm:mb-6 leading-tight">
            Trusted by{" "}
            <span className="text-secondary font-Montserrat">10,000+</span>{" "}
            smart homes & businesses
          </h2>

          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-10 max-w-lg">
            Don't just take our word for it. Here's what our community says
            about their experience.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col"
              >
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < testimonial.rating ? "currentColor" : "none"}
                        className={`${
                          i < testimonial.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {testimonial.date}
                  </span>
                </div>

                <div className="relative mb-4 sm:mb-5">
                  <Quote className="absolute -top-2 -left-2 text-gray-200 w-5 h-5 sm:w-6 sm:h-6" />
                  <p className="text-sm sm:text-base text-gray-700 relative z-10">
                    "{testimonial.feedback}"
                  </p>
                </div>

                <div className="flex items-center mt-auto">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div className="ml-2 sm:ml-3">
                    <p className="text-sm sm:text-base text-gray-900 font-medium">
                      {testimonial.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {testimonial.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 sm:mt-8 flex items-center gap-3 sm:gap-4">
            <button className="bg-white p-1 sm:p-2 rounded-full shadow-sm hover:shadow-md transition border border-gray-200">
              <ChevronLeft className="text-gray-700 w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button className="bg-white p-1 sm:p-2 rounded-full shadow-sm hover:shadow-md transition border border-gray-200">
              <ChevronRight className="text-gray-700 w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <span className="text-xs sm:text-sm text-gray-500 ml-1 sm:ml-2">
              Scroll to see more
            </span>
          </div>
        </div>

        {/* Product Gallery Section */}
        <div className="w-full lg:w-1/2 self-center mt-8 lg:mt-0">
          <div className="mb-2 flex items-center gap-2">
            <div className="w-4 h-0.5 bg-secondary"></div>
            <span className="text-sm font-medium tracking-wider text-secondary uppercase font-Montserrat">
              Featured Products
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4 sm:mb-6 leading-tight">
            Explore Our{" "}
            <span className="text-secondary font-Montserrat">Smart</span>{" "}
            Collection
          </h2>

          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-lg">
            Discover the devices powering these transformations.
          </p>

          <div className="relative">
            <div
              ref={scrollContainer}
              className="grid grid-flow-col auto-cols-[minmax(120px,1fr)] sm:auto-cols-[minmax(150px,1fr)] md:auto-cols-[minmax(200px,1fr)] gap-3 sm:gap-4 overflow-x-auto pb-4 sm:pb-6 scrollbar-hide"
            >
              {productImages.map((image, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-lg sm:rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 aspect-square"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 sm:p-4">
                    <span className="text-white font-medium text-xs sm:text-sm">
                      {image.alt}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={scrollLeft}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-1 sm:p-2 rounded-full shadow-md hover:shadow-lg transition hidden sm:block"
            >
              <ChevronLeft className="text-secondary cursor-pointer w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={scrollRight}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-1 sm:p-2 rounded-full shadow-md hover:shadow-lg transition hidden sm:block"
            >
              <ChevronRight className="text-secondary cursor-pointer w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <Link to="/products" className="mt-6 block sm:mt-8 text-center">
            <Button
              variant="secondary"
              className="px-6 sm:px-8 py-2 sm:py-3 bg-primary text-white font-medium rounded-lg hover:bg-[#434d64] cursor-pointer font-Rubik transition shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
