import { useEffect, useState } from "react";
import api from "../api";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function DashboardPage() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    userCount: 0,
    orderCount: 0,
    productCount: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    (async () => {
      try {
      const res = await api.getUserStats();
      if (Array.isArray(res)) {
        const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formatted = res.map((item) => ({
          name: months[item._id],
          "Số user mới": item.total,
        }));
        setData(formatted);
      }
      } catch (error) {
        console.error("Lỗi khi lấy user stats:", error);
      }

      try {
      const overview = await api.getOverviewStats();
        if (overview) {
          setStats(overview);
        } else {
          console.warn("Không nhận được dữ liệu overview từ API.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy overview stats:", error);
      }
    })();
  }, []);

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">📊 Thống kê người dùng mới theo tháng</h2>

      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
              <Line type="monotone" dataKey="Số user mới" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex flex-col justify-between h-full">
          <div>
            <h3 className="text-lg font-semibold mb-2">👥 Tổng người dùng</h3>
            <p className="text-3xl font-bold">{stats.userCount}</p>
            </div>
          </div>

        <div className="bg-green-500 text-white p-6 rounded-lg shadow-md flex flex-col justify-between h-full">
          <div>
            <h3 className="text-lg font-semibold mb-2">🛒 Tổng đơn hàng</h3>
            <p className="text-3xl font-bold">{stats.orderCount}</p>
            </div>
          </div>

        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md flex flex-col justify-between h-full">
          <div>
            <h3 className="text-lg font-semibold mb-2">📦 Tổng sản phẩm</h3>
            <p className="text-3xl font-bold">{stats.productCount}</p>
            </div>
          </div>

        <div className="bg-red-500 text-white p-6 rounded-lg shadow-md flex flex-col justify-between h-full">
          <div>
            <h3 className="text-lg font-semibold mb-2">💰 Doanh thu</h3>
            <p className="text-3xl font-bold">{stats.totalRevenue.toLocaleString()}₫</p>
            </div>
          </div>
        </div>
      </div>
  );
}
