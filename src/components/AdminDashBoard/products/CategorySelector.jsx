import PropTypes from 'prop-types';

const categories = [
  { value: "smart-home", label: "Smart Home" },
  { value: "industrial-iot", label: "Industrial IoTs" },
  { value: "wearables", label: "Wearables" },
  { value: "smart-city", label: "Smart City" },
  { value: "modules", label: "Modules & Generic Devices" },
  { value: "tracking", label: "Smart Tracking" },
];

const CategorySelector = ({ value, onChange }) => {
  return (
    <div className="relative w-full group">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 font-Rubik py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer appearance-none bg-white shadow-sm text-gray-700 font-medium"
      >
        <option value="" className="text-gray-400 italic">
          Select a category
        </option>
        {categories.map((category) => (
          <option
            key={category.value}
            value={category.value}
            className="text-gray-700 hover:bg-blue-50" // Added hover state
          >
            {category.label}
          </option>
        ))}
      </select>

      {/* Custom Chevron (matches your reference design) */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none transition-transform duration-200 group-hover:translate-y-0.5">
        <svg
          className="w-6 h-6 text-gray-400 group-focus:text-blue-500 transition-colors duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};

CategorySelector.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default CategorySelector;