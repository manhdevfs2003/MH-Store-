import { Outlet, Link } from "react-router-dom";
// Đảm bảo file index.css (chứa @tailwind directives) được import ở file chính như main.jsx hoặc App.jsx
// import '../index.css'; // Không cần import ở đây nếu đã import ở file gốc
export default function AdminLayout() {
  return (
    // Sử dụng flex để sidebar và main content nằm cạnh nhau
    // min-h-screen để layout chiếm toàn bộ chiều cao màn hình
    <div className="flex min-h-screen font-sans bg-gray-50">
      {/* Sidebar (Cột bên trái) */}
      <aside className="w-64 bg-white shadow-md p-6 md:p-10 border-r border-gray-200 flex flex-col">
        <h2 className="text-xl font-bold text-blue-700 mb-8">Admin Panel</h2>
        <nav className="space-y-3 flex-grow"> {/* flex-grow để nav chiếm không gian còn lại nếu cần */}
          <Link
            to="/"
            className="block px-3 py-2 rounded-md hover:bg-blue-100 text-gray-700 font-medium"
          >
            🏠 Dashboard
          </Link>
          <Link
            to="/products"
            className="block px-3 py-2 rounded-md hover:bg-blue-100 text-gray-700 font-medium"
          >
            📦 Product Management
          </Link>
          <Link
            to="/users"
            className="block px-3 py-2 rounded-md hover:bg-blue-100 text-gray-700 font-medium"
          >
            👤 User List
          </Link>
          {/* Bạn có thể thêm các link khác ở đây */}
        </nav>
        {/* Nút Logout có thể đặt ở cuối sidebar nếu muốn */}
        {/* <hr className="my-4 border-gray-300" />
        <button
          onClick={() => {
            localStorage.removeItem("adminUser");
            window.location.href = "/login";
          }}
          className="w-full mt-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-md z-10"
        >
          🔓 Logout
        </button> */}
      </aside>

      {/* Main Content (Cột bên phải) */}
      {/* flex-1 để phần này chiếm hết không gian còn lại */}
      {/* relative để làm gốc định vị cho nút Logout bên trong nó */}
      <main className="flex-1 bg-gray-100 relative">
        {/* Nút Logout được đặt ở góc phải trên của Main Content */}
        <button
          onClick={() => {
            localStorage.removeItem("adminUser");
            window.location.href = "/login";
          }}
          // top-6 right-6 để có khoảng cách với padding của main content (nếu main content có padding)
          className="absolute top-6 right-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-md z-10"
        >
          🔓 Logout
        </button>

        {/* Nội dung của từng trang sẽ được render ở đây */}
        {/* pt-20 (padding-top) để nội dung không bị nút Logout che khuất */}
        <div className="mx-auto p-6 md:p-8 pt-20 md:pt-24">
    <Outlet />
  </div>
</main>
    </div>
  );
}
