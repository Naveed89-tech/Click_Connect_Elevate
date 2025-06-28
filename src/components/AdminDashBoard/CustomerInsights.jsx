import PropTypes from "prop-types";

const CustomerInsights = ({ customerStats, trafficSources }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Customer Insights
      </h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Total Customers</p>
          <p className="text-2xl font-semibold">
            {customerStats.totalCustomers}
          </p>
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <p className="text-sm text-gray-500">New Customers</p>
            <p className="text-xl font-semibold text-green-600">
              {customerStats.newCustomers}
            </p>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500">Returning Customers</p>
            <p className="text-xl font-semibold text-blue-600">
              {customerStats.returningCustomers}
            </p>
          </div>
        </div>
        <div className="pt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Traffic Sources
          </h3>
          <div className="space-y-2">
            {Object.entries(trafficSources).map(([source, percent]) => (
              <div key={source} className="flex items-center">
                <div className="w-24 text-sm text-gray-500 capitalize">
                  {source}
                </div>
                <div className="flex-1">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        source === "organic"
                          ? "bg-green-500"
                          : source === "direct"
                          ? "bg-blue-500"
                          : source === "social"
                          ? "bg-purple-500"
                          : source === "paid"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                      }`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-10 text-right text-sm font-medium">
                  {percent}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

CustomerInsights.propTypes = {
  customerStats: PropTypes.shape({
    totalCustomers: PropTypes.number.isRequired,
    newCustomers: PropTypes.number.isRequired,
    returningCustomers: PropTypes.number.isRequired,
  }).isRequired,
  trafficSources: PropTypes.object.isRequired,
};

export default CustomerInsights;
