import { useEffect, useState } from "react";

import { formatDistanceToNow } from "date-fns";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import {
  FiBarChart2,
  FiCalendar,
  FiDollarSign,
  FiPackage,
  FiPieChart,
  FiShoppingCart,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { db } from "../../firebase";
import MetricCard from "./MetricCard";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState("week");
  const [topProductsData, setTopProductsData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [weeklyPerformanceData, setWeeklyPerformanceData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [metrics, setMetrics] = useState([
    {
      icon: <FiDollarSign className="h-6 w-6 text-blue-600" />,
      title: "Total Revenue",
      value: "$0.00",
      change: "0%",
      isPositive: true,
    },
    {
      icon: <FiShoppingCart className="h-6 w-6 text-green-600" />,
      title: "Total Orders",
      value: "0",
      change: "0%",
      isPositive: true,
    },
    {
      icon: <FiPackage className="h-6 w-6 text-purple-600" />,
      title: "Avg. Order Value",
      value: "$0.00",
      change: "0%",
      isPositive: true,
    },
    {
      icon: <FiUsers className="h-6 w-6 text-yellow-600" />,
      title: "New Customers",
      value: "0",
      change: "0%",
      isPositive: true,
    },
  ]);

  // Fetch recent orders
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecentOrders(orders);
    });
    return () => unsubscribe();
  }, []);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch orders for metrics and sales data
        const ordersSnapshot = await getDocs(collection(db, "orders"));
        const orders = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch products for top products
        const productsSnapshot = await getDocs(collection(db, "products"));
        const products = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Calculate metrics
        const totalRevenue = orders.reduce(
          (sum, order) => sum + (order.total || 0),
          0
        );
        const totalOrders = orders.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Get unique customers (assuming orders have userId)
        const uniqueCustomers = new Set(orders.map((order) => order.userId))
          .size;

        setMetrics([
          {
            icon: <FiDollarSign className="h-6 w-6 text-blue-600" />,
            title: "Total Revenue",
            value: `$${totalRevenue.toFixed(2)}`,
            change: "+12%", // You can implement real change calculation
            isPositive: true,
          },
          {
            icon: <FiShoppingCart className="h-6 w-6 text-green-600" />,
            title: "Total Orders",
            value: `${totalOrders}`,
            change: "+5%",
            isPositive: true,
          },
          {
            icon: <FiPackage className="h-6 w-6 text-purple-600" />,
            title: "Avg. Order Value",
            value: `$${avgOrderValue.toFixed(2)}`,
            change: "-2%",
            isPositive: false,
          },
          {
            icon: <FiUsers className="h-6 w-6 text-yellow-600" />,
            title: "New Customers",
            value: `${uniqueCustomers}`,
            change: "+8%",
            isPositive: true,
          },
        ]);

        // Prepare sales data (group by month)
        const monthlySales = {};
        orders.forEach((order) => {
          if (order.createdAt) {
            const date = new Date(order.createdAt.seconds * 1000);
            const month = date.toLocaleString("default", { month: "short" });
            if (!monthlySales[month]) {
              monthlySales[month] = { revenue: 0, orders: 0 };
            }
            monthlySales[month].revenue += order.total || 0;
            monthlySales[month].orders += 1;
          }
        });

        const salesArray = Object.keys(monthlySales).map((month) => ({
          name: month,
          ...monthlySales[month],
        }));
        setSalesData(salesArray);

        // Prepare top products data
        const productSales = {};
        orders.forEach((order) => {
          if (order.items) {
            order.items.forEach((item) => {
              if (!productSales[item.id]) {
                productSales[item.id] = {
                  name: item.name || `Product ${item.id}`,
                  value: 0,
                  fill: "#" + Math.floor(Math.random() * 16777215).toString(16),
                };
              }
              productSales[item.id].value +=
                (item.price || 0) * (item.quantity || 1);
            });
          }
        });

        const topProducts = Object.values(productSales)
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);
        setTopProductsData(topProducts);

        // Prepare weekly performance data (real data from orders)
        const weeklyStats = [
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
          "Sun",
        ].map((day) => ({
          day,
          sales: 0,
          visitors: 0, // You'll need actual visitor data for this
        }));

        // Populate with real sales data if available
        orders.forEach((order) => {
          if (order.createdAt) {
            const date = new Date(order.createdAt.seconds * 1000);
            const dayIndex = date.getDay(); // 0=Sun, 1=Mon, etc.
            const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
              dayIndex
            ];
            const dayStat = weeklyStats.find((d) => d.day === dayName);
            if (dayStat) {
              dayStat.sales += 1;
            }
          }
        });

        setWeeklyPerformanceData(weeklyStats);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const topProductsLimited = topProductsData.slice(0, 3);

  return (
    <div>
      {/* Rest of your JSX remains exactly the same */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <div className="flex items-center space-x-2">
          <FiCalendar className="text-gray-500" />
          <select
            className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            icon={metric.icon}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            isPositive={metric.isPositive}
          />
        ))}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Sales Overview Chart */}
        <div className="bg-white shadow rounded-lg p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              <FiTrendingUp className="inline mr-2 text-blue-500" />
              Sales Overview
            </h2>
            <div className="flex space-x-2 text-sm">
              <span className="flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
                Revenue
              </span>
              <span className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                Orders
              </span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue ($)"
                  stroke="#3B82F6"
                  fill="#93C5FD"
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="#10B981"
                  fill="#6EE7B7"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            <FiPieChart className="inline mr-2 text-purple-500" />
            Top Products
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart className="font-Montserrat text-[12px]">
                <Pie
                  data={topProductsLimited}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {topProductsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{
                    paddingTop: "20px",
                    fontSize: "12px",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                  iconSize={10}
                  iconType="circle"
                  formatter={(value, entry, index) => (
                    <span className="text-gray-700">
                      {value}: ${entry.payload.value.toFixed(0)}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Weekly Performance */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            <FiBarChart2 className="inline mr-2 text-green-500" />
            Weekly Performance
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyPerformanceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" orientation="left" stroke="#3B82F6" />
                <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="sales"
                  name="Sales"
                  fill="#3B82F6"
                />
                <Bar
                  yAxisId="right"
                  dataKey="visitors"
                  name="Visitors"
                  fill="#10B981"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentOrders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <FiShoppingCart className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    New order #{order.orderId || order.id}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.customer || "Customer"} placed a new order
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {order.createdAt?.seconds
                    ? formatDistanceToNow(
                        new Date(order.createdAt.seconds * 1000),
                        {
                          addSuffix: true,
                        }
                      )
                    : "Just now"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
