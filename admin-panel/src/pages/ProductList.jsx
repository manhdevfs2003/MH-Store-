import { useEffect, useState } from "react"
import api from "../api"
import { Link } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL;

export default function ProductList() {
  const [products, setProducts] = useState([])
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/products");
        if (Array.isArray(res)) {
          setProducts(res);
        } else {
          console.warn("API không trả về một mảng sản phẩm:", res);
          setProducts([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        setProducts([]);
      }
    })();
  }, [])

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xoá sản phẩm này?");
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem("accessToken"); 
      const res = await fetch(`${API_URL}/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });
      const data = await res.json();
      if (data.status === "ok") {
        alert("Xoá thành công!");
        setProducts(products.filter((p) => p._id !== productId));
      } else {
        alert(data.message || "Xoá thất bại!");
      }
    } catch (err) {
      console.error("❌ Lỗi xoá:", err);
      alert("Lỗi khi xoá sản phẩm!");
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
        <Link
          to="/products/new"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          Add New Product
        </Link>
      </div>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase">
              <th className="p-3 border-b">Image</th>
              <th className="p-3 border-b">Title</th>
              <th className="p-3 border-b text-center">Price</th>
              <th className="p-3 border-b text-center">Category</th>
              <th className="p-3 border-b text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50 border-b">
                  <td className="p-3 align-middle">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-16 h-16 object-cover mx-auto rounded"
                    />
                  </td>
                  <td className="p-3 align-middle text-gray-700">{p.title}</td>
                  <td className="p-3 align-middle text-gray-700 text-center">{p.price.toLocaleString()}₫</td>
                  <td className="p-3 align-middle text-gray-700 text-center">{p.categories?.join(", ")}</td>
                  <td className="p-3 align-middle text-center space-x-2">
                    <Link
                      to={`/products/edit/${p._id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
