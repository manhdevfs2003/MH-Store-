import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function OrderList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
                                (async () => {
                                  const res = await api.getAll("/api/orders"); // ✅ phải gọi đúng endpoint
                                  if (Array.isArray(res)) setOrders(res);
                                })();
                              }, []);
                              

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Quản lý đơn hàng</h2>
      <table className="w-full border">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Mã đơn</th>
            <th className="p-2">Tổng tiền</th>
            <th className="p-2">Trạng thái</th>
            <th className="p-2">Ngày tạo</th>
            <th className="p-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-t">
              <td className="p-2">{order._id}</td>
              <td className="p-2">{order.amount.toLocaleString()}₫</td>
              <td className="p-2 capitalize">{order.status}</td>
              <td className="p-2">{new Date(order.createdAt).toLocaleString()}</td>
              <td className="p-2">
                <Link
                  to={`/orders/${order._id}`}
                  className="text-blue-600 hover:underline"
                >
                  Chi tiết
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
