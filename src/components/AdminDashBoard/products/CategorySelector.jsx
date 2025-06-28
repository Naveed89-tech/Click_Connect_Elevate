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
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select a category</option>
      {categories.map((category) => (
        <option key={category.value} value={category.value}>
          {category.label}
        </option>
      ))}
    </select>
  );
};

CategorySelector.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default CategorySelector;