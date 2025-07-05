import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.getUsers();
        console.log("API response:", res);
        
        // Kiểm tra phản hồi từ API
        if (Array.isArray(res)) {
          setUsers(res);
        } else if (res && Array.isArray(res.users)) {
          setUsers(res.users);
        } else {
          console.error("Invalid response format:", res);
          setError("Dữ liệu người dùng không hợp lệ");
          setUsers([]);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Không thể tải danh sách người dùng. Kiểm tra quyền truy cập.");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Bạn có chắc muốn xoá người dùng này?");
    if (!confirmed) return;

    try {
      const res = await api.deleteUser(id);
      if (res.status === "ok") {
        alert("✔ Người dùng đã được xoá!");
        setUsers(users.filter((u) => u._id !== id));
      } else {
        alert("❌ Lỗi khi xoá người dùng.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Lỗi khi xoá người dùng.");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Đang tải danh sách người dùng...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-600 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Danh sách người dùng</h2>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Họ tên</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Admin</th>
            <th className="p-2 border">Ngày tạo</th>
            <th className="p-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-500">
                Không có người dùng nào
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-2 border">{user.fullname}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border text-center">
                  {user.isAdmin ? "✔" : "–"}
                </td>
                <td className="p-2 border">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 border text-center space-x-2">
                  <button
                    onClick={() => navigate(`/users/${user._id}`)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}