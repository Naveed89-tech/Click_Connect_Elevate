import PropTypes from "prop-types";

const AlertCard = ({ icon, title, value, action, color }) => {
  const colorClasses = {
    red: "bg-red-50 border-red-100",
    yellow: "bg-yellow-50 border-yellow-100",
    blue: "bg-blue-50 border-blue-100",
  };

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-white">{icon}</div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{title}</p>
            <p className="text-sm text-gray-500">
              {value} items need attention
            </p>
          </div>
        </div>
        <button className="text-sm font-medium text-gray-700 hover:text-gray-900">
          {action}
        </button>
      </div>
    </div>
  );
};

AlertCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  action: PropTypes.string.isRequired,
  color: PropTypes.oneOf(["red", "yellow", "blue"]).isRequired,
};

export default AlertCard;
