import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../api" // đảm bảo bạn đã export updateProduct trong file này

export default function EditProduct() {
  const { id } = useParams()
  const productId = id
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    categories: "",
    image: "",
  })

  useEffect(() => {
    (async () => {
      const res = await api.get(`/api/products/${id}`)
      setProduct(res)
      setFormData({
        title: res.title || "",
        price: res.price || "",
        categories: res.categories?.join(", ") || "",
        image: res.image || "",
      })
    })()
  }, [id])

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { title, price, categories, image } = formData
    const updatedData = {
      title,
      price,
      categories: categories.split(",").map((c) => c.trim()),
      image,
    }

    const result = await api.updateProduct(productId, updatedData)

    if (result.status === "ok") {
      alert("✔ Sản phẩm đã được cập nhật!")
      navigate("/products")
    } else {
      alert("❌ Lỗi khi cập nhật: " + result.message)
    }
  }

  if (!product) return <div className="p-4">Loading...</div>

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold">Edit Product</h2>

      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
        className="w-full border px-2 py-1"
        required
      />
      <input
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        className="w-full border px-2 py-1"
        required
      />
      <input
        name="categories"
        value={formData.categories}
        onChange={handleChange}
        placeholder="Categories (comma separated)"
        className="w-full border px-2 py-1"
      />
      <input
        name="image"
        value={formData.image}
        onChange={handleChange}
        placeholder="Image URL"
        className="w-full border px-2 py-1"
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Lưu
      </button>
    </form>
  )
}
