import { Navigate } from "react-router-dom"

export default function RequireAdmin({ children }) {
  const user = JSON.parse(localStorage.getItem("adminUser"))
  console.log(" Admin user:", user)

  if (!user || user.isAdmin !== true) {
    alert("Bạn không có quyền truy cập admin.")
    return <Navigate to="/login" replace />
  }

  return children
}
