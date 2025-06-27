import { useState, useEffect } from "react";
import {
  FiShoppingCart,
  FiUsers,
  FiDollarSign,
  FiPackage,
  FiTrendingUp,
  FiBarChart2,
  FiPieChart,
  FiCalendar,
} from "react-icons/fi";
import MetricCard from "../components/Jobseek/MetricCard";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  collection,
  getDocs,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { formatDistanceToNow } from "date-fns";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState("week");
  const [topProductsData, setTopProductsData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [weeklyPerformanceData, setWeeklyPerformanceData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

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
  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const products = querySnapshot.docs.map((doc) => doc.data());

      const topProducts = products
        .filter((p) => p.price)
        .map((p) => ({
          name: p.name,
          value: p.price * (p.reviewCount || 1),
          fill: "#" + Math.floor(Math.random() * 16777215).toString(16),
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      setTopProductsData(topProducts);

      const monthlyRevenue = {};
      products.forEach((p) => {
        if (p.createdAt && p.price) {
          const date = new Date(p.createdAt.seconds * 1000);
          const month = date.toLocaleString("default", { month: "short" });
          if (!monthlyRevenue[month]) {
            monthlyRevenue[month] = { revenue: 0, orders: 0 };
          }
          monthlyRevenue[month].revenue += p.price;
          monthlyRevenue[month].orders += 1;
        }
      });

      const salesArray = Object.keys(monthlyRevenue).map((month) => ({
        name: month,
        ...monthlyRevenue[month],
      }));

      setSalesData(salesArray);

      const weeklyStats = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
        (day) => ({
          day,
          sales: Math.floor(Math.random() * 50) + 10,
          visitors: Math.floor(Math.random() * 300) + 100,
        })
      );

      setWeeklyPerformanceData(weeklyStats);
    };

    fetchProducts();
  }, []);

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

  useEffect(() => {
    const fetchMetrics = async () => {
      const productsSnapshot = await getDocs(collection(db, "products"));
      const products = productsSnapshot.docs.map((doc) => doc.data());

      const totalRevenue = products.reduce((sum, p) => sum + (p.cost || 0), 0);
      const totalOrders = products.length;
      const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      setMetrics([
        {
          icon: <FiDollarSign className="h-6 w-6 text-blue-600" />,
          title: "Total Revenue",
          value: `$${totalRevenue.toFixed(2)}`,
          change: "+12%", // Placeholder or real calc
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
          value: `$${avgOrder.toFixed(2)}`,
          change: "-2%",
          isPositive: false,
        },
        {
          icon: <FiUsers className="h-6 w-6 text-yellow-600" />,
          title: "New Customers",
          value: "87", // Replace with real value if you track users
          change: "+8%",
          isPositive: true,
        },
      ]);
    };

    fetchMetrics();
  }, []);
  const topProductsLimited = topProductsData
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 ">
          Dashboard Overview
        </h1>
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
