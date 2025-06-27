import {
  FaMobileAlt,
  FaIndustry,
  FaGamepad,
  FaCity,
  FaHeadphones,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const categories = [
  { icon: <FaMobileAlt />, label: "Smart Home", path: "/smart-home" },
  { icon: <FaIndustry />, label: "Industrial IoT", path: "/industrial-iot" },
  { icon: <FaGamepad />, label: "Wearables", path: "/wearables" },
  { icon: <FaCity />, label: "Smart City", path: "/smart-city" },
  {
    icon: <FaHeadphones />,
    label: "Modules & Generic Devices",
    path: "/modules",
  },
  { icon: <FaMapMarkerAlt />, label: "Smart Tracking", path: "/tracking" },
];

const CategoryStrip = () => {
  return (
    // Hide on mobile (`sm:` breakpoint in Tailwind = 640px)
    <div className="bg-primary text-white text-sm py-4 px-4 hidden sm:block">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3">
          {categories.map((cat, i) => (
            <div key={i} className="flex items-center">
              <Link
                to={cat.path}
                className="flex items-center space-x-2 text-white opacity-50 transition hover:cursor-pointer hover:text-secondary hover:opacity-100"
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="whitespace-nowrap">{cat.label}</span>
              </Link>
              {i < categories.length - 1 && (
                <div className="mx-2 text-gray-500">|</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryStrip;
