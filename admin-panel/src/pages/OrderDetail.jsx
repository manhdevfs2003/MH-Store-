import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function OrderDetail() {
  const { id } = useParams(); // orderID
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    (async () => {
      const res = await api.getOrderDetail(id); // gọi API lấy chi tiết đơn
      if (res?.status === "ok") {
        setOrder(res.order);
        setStatus(res.order.status);
      } else {
        alert("Không tìm thấy đơn hàng.");
        navigate("/orders");
      }
    })();
  }, [id]);

  const handleStatusUpdate = async () => {
                                const res = await api.putOrder(`/orders/${id}`, { status });
                                console.log("🛠️ Kết quả cập nhật:", res); // ✅ Ghi log
                                if (res?.status === "ok") {
                                  alert("✔ Cập nhật trạng thái thành công!");
                                } else {
                                  alert("❌ Lỗi khi cập nhật trạng thái.");
                                }
                              };
                              

  if (!order) return <div className="p-6">Đang tải đơn hàng...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Chi tiết đơn hàng</h2>

      {/* Nút quay lại */}
      <button
        onClick={() => navigate("/orders")}
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded"
      >
        ← Quay lại danh sách đơn hàng
      </button>

      <div className="mb-4">
        <strong>Mã đơn:</strong> {order._id} <br />
        <strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleString()} <br />
        <strong>Tổng tiền:</strong> {order.amount.toLocaleString()}₫ <br />
      </div>

      <div className="mb-4">
        <strong>Địa chỉ giao hàng:</strong>
        <pre className="bg-gray-100 p-2 mt-1">
          {JSON.stringify(order.address, null, 2)}
        </pre>
      </div>

      {/* Dropdown cập nhật trạng thái */}
      <div className="mb-4">
        <strong>Trạng thái:</strong>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 ml-2"
        >
          <option value="pending">pending</option>
          <option value="confirmed">confirmed</option>
          <option value="processing">processing</option>
          <option value="shipped">shipped</option>
          <option value="in transit">in transit</option>
          <option value="delivered">delivered</option>
          <option value="cancelled">cancelled</option>
        </select>
        <button
          onClick={handleStatusUpdate}
          className="ml-3 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Cập nhật
        </button>
      </div>

      {/* Danh sách sản phẩm */}
      <h3 className="text-lg font-semibold mt-4 mb-2">Sản phẩm:</h3>
      <ul className="space-y-2">
        {order.products.map((item) => (
          <li key={item.productID._id} className="border p-2 rounded">
            <strong>{item.productID.title}</strong> – Số lượng: {item.quantity} <br />
            <img
              src={item.productID.image}
              alt={item.productID.title}
              className="w-20 mt-2"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
