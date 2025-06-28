import PropTypes from 'prop-types';

const MetricCard = ({ icon, title, value, change, isPositive }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-gray-50">
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
      <div className={`mt-4 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {change} from last period
      </div>
    </div>
  );
};

MetricCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  change: PropTypes.string.isRequired,
  isPositive: PropTypes.bool.isRequired,
};

export default MetricCard;