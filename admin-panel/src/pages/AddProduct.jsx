import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    categories: "",
    color: "",
    size: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProduct = {
      ...form,
      price: Number(form.price),
      categories: form.categories.split(",").map((c) => c.trim()),
      color: form.color.split(",").map((c) => c.trim()),
      size: form.size.split(",").map((s) => s.trim()),
    };

    try {
      const res = await api.addProduct(newProduct);
      if (res?.status === "ok") {
        alert("✔ Sản phẩm đã được thêm!");
        navigate("/products");
      } else {
        alert("❌ Lỗi khi thêm sản phẩm: " + (res?.message || "Không rõ nguyên nhân"));
      }
    } catch (err) {
      console.error("❌ Lỗi gửi API:", err);
      alert("Đã xảy ra lỗi khi thêm sản phẩm.");
    }
  };

  return (
    <div className="flex justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">
          🧾 Thêm sản phẩm mới
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Label nằm trên input */}
          {[
            { label: "Tên sản phẩm", name: "title" },
            { label: "Mô tả", name: "description" },
            { label: "Giá", name: "price", type: "number" },
            { label: "Phân loại (cách nhau bằng dấu phẩy)", name: "categories" },
            { label: "Màu sắc (cách nhau bằng dấu phẩy)", name: "color" },
            { label: "Kích cỡ (cách nhau bằng dấu phẩy)", name: "size" },
            { label: "Link ảnh", name: "image" },
          ].map(({ label, name, type = "text" }) => (
            <div key={name}>
              <label className="block mb-1 font-medium text-gray-700">{label}</label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={label}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow"
          >
             Thêm sản phẩm
          </button>
        </form>
      </div>
    </div>
  );
}
