import { FiAlertCircle, FiShoppingCart, FiTrendingUp } from "react-icons/fi";
import AlertCard from "./AlertCard";
import PropTypes from "prop-types";

const AlertsSection = ({ alerts }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Alerts & Actions
      </h2>
      <div className="space-y-4">
        <AlertCard
          icon={<FiAlertCircle className="h-5 w-5 text-red-500" />}
          title="Low Stock Items"
          value={alerts.lowStock}
          action="View Products"
          color="red"
        />
        <AlertCard
          icon={<FiShoppingCart className="h-5 w-5 text-yellow-500" />}
          title="Pending Orders"
          value={alerts.pendingOrders}
          action="Process Orders"
          color="yellow"
        />
        <AlertCard
          icon={<FiTrendingUp className="h-5 w-5 text-blue-500" />}
          title="Abandoned Carts"
          value={alerts.abandonedCarts}
          action="Send Reminder"
          color="blue"
        />
      </div>
    </div>
  );
};

AlertsSection.propTypes = {
  alerts: PropTypes.shape({
    lowStock: PropTypes.number.isRequired,
    pendingOrders: PropTypes.number.isRequired,
    abandonedCarts: PropTypes.number.isRequired,
  }).isRequired,
};

export default AlertsSection;
