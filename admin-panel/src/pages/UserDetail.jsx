import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [fullname, setFullname] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await api.getUser(id);
      if (res?._id) {
        setUser(res);
        setFullname(res.fullname || "");
        setIsAdmin(res.isAdmin || false);
      } else {
        alert("Không tìm thấy người dùng.");
        navigate("/users");
      }
    })();
  }, [id]);

  const handleUpdate = async () => {
                                const res = await api.updateUserAsAdmin(id, { isAdmin });
                                if (res.status === "ok") {
                                  alert("✔ Cập nhật quyền thành công!");
                                } else {
                                  alert("❌ Cập nhật thất bại.");
                                }
                              };
                              
                              


  if (!user) return <div className="p-6">Đang tải thông tin...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold mb-4">Thông tin người dùng</h2>

      <div>
        <label className="block font-semibold">Họ tên:</label>
        <input
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block font-semibold">Email:</label>
        <input
          value={user.email}
          disabled
          className="w-full border px-3 py-2 bg-gray-100 rounded"
        />
      </div>

      <div>
        <label className="block font-semibold">Admin:</label>
        <input
          type="checkbox"
          checked={isAdmin}
          onChange={() => setIsAdmin(!isAdmin)}
        />{" "}
        <span>{isAdmin ? "✔ Là admin" : "– Người dùng thường"}</span>
      </div>

      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Cập nhật
      </button>
    </div>
  );
}
