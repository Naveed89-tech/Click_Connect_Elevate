import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  motion,
  useAnimation,
} from 'framer-motion';
import {
  FaCity,
  FaGamepad,
  FaIndustry,
  FaMapMarkerAlt,
  FaMobileAlt,
} from 'react-icons/fa';
import { FiCpu } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const categories = [
  { name: "Smart Home", icon: <FaMobileAlt />, path: "/smart-home" },
  { name: "Industrial IoT", icon: <FaIndustry />, path: "/industrial-iot" },
  { name: "Wearables", icon: <FaGamepad />, path: "/wearables" },
  { name: "Smart City", icon: <FaCity />, path: "/smart-city" },
  {
    name: "Generic Devices",
    icon: <FiCpu />,
    path: "/modules",
  },
  { name: "Smart Tracking", icon: <FaMapMarkerAlt />, path: "/tracking" },
];

function BrowseByCategory() {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();
  const containerRef = useRef();
  const itemWidth = 180;

  const scrollDelay = 3000;
  const scrollDuration = 800;
  const timeoutRef = useRef();

  const duplicatedCategories = [...categories, ...categories];

  useEffect(() => {
    let isMounted = true;

    const scrollToNextItem = async () => {
      if (!isMounted || isHovered) return;

      const currentX = parseFloat(
        containerRef.current.style.transform?.match(
          /translateX\(([^)]+)px\)/
        )?.[1] || 0
      );

      const nextX = currentX - itemWidth;
      const maxScroll = -(categories.length * itemWidth);

      if (nextX <= maxScroll) {
        await controls.set({ x: 0 });
      } else {
        await controls.start({
          x: nextX,
          transition: { duration: scrollDuration / 1000, ease: "easeInOut" },
        });
      }

      if (isMounted) {
        timeoutRef.current = setTimeout(scrollToNextItem, scrollDelay);
      }
    };

    timeoutRef.current = setTimeout(scrollToNextItem, scrollDelay);

    return () => {
      isMounted = false;
      clearTimeout(timeoutRef.current);
    };
  }, [isHovered, controls]);

  return (
    <section className="px-4 md:px-16 pb-16 bg-background font-Roboto pt-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Explore Categories
          </h2>
          <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our curated tech categories to find the perfect product for
            your next innovation.
          </p>
        </div>

        <div
          className="relative overflow-hidden w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Gradient fade effect on sides */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

          <motion.div
            ref={containerRef}
            className="flex gap-6 pb-8"
            animate={controls}
            style={{ width: "fit-content" }}
            drag="x"
            dragConstraints={{
              right: 0,
              left: -(categories.length * itemWidth),
            }}
            dragElastic={0.1}
          >
            {duplicatedCategories.map((cat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="w-[120px] md:w-[160px] h-28 md:h-32 flex-shrink-0"
              >
                <Link
                  to={cat.path}
                  className="h-full flex flex-col gap-3 sm:gap-4 items-center justify-center text-center p-4 sm:p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-primary/20"
                >
                  <div className="w-14 md:w-16 aspect-square rounded-full bg-gradient-to-br from-secondary/10 to-primary/10 text-primary flex items-center justify-center transition-all">
                    {React.cloneElement(cat.icon, {
                      size: window.innerWidth < 640 ? 20 : 24,
                      className: "transition-transform group-hover:scale-110",
                    })}
                  </div>
                  <span className="text-[10px] sm:text-[12px] md:text-sm font-medium text-gray-800">
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Modern scroll indicators (dots) */}
          <div className="flex justify-center gap-2 mt-6">
            {categories.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-gray-300 opacity-70"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default BrowseByCategory;
