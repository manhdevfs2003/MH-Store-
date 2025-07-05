import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import AdminLayout from "./layout/AdminLayout"
import RequireAdmin from "./components/RequireAdmin"
import ProductList from "./pages/ProductList.jsx"
import AddProduct from "./pages/AddProduct.jsx"
import EditProduct from "./pages/EditProduct.jsx"
import OrderList from "./pages/OrderList.jsx"
import OrderDetail from "./pages/OrderDetail"; // thêm đầu file
import UserList from "./pages/UserList.jsx"
import UserDetail from "./pages/UserDetail.jsx"
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <RequireAdmin>
          <AdminLayout />
        </RequireAdmin>
      }>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductList />} />
<Route path="products/new" element={<AddProduct />} />
<Route path="products/edit/:id" element={<EditProduct />} />
<Route path="orders" element={<OrderList />} /> 
<Route path="orders/:id" element={<OrderDetail />} />
<Route path="/users" element={<RequireAdmin><UserList /></RequireAdmin>} />
<Route path="/users/:id" element={<RequireAdmin><UserDetail /></RequireAdmin>} />

      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
