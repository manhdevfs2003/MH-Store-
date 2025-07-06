const API_URL = import.meta.env.VITE_API_URL;
import { jwtDecode } from "jwt-decode"; // ✅ đúng cách import ES Module

// ✅ Hàm GET dữ liệu (dùng cho fetch sản phẩm, đơn hàng...)
export async function get(path) {
  const res = await fetch(API_URL + path);
  return await res.json();
}

// ❌ Các hàm dưới đây là tùy chọn (nếu bạn muốn thêm/sửa/xóa)
export async function post(path, data) {
  const res = await fetch(API_URL + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function put(path, data) {
  const res = await fetch(API_URL + path, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function del(path) {
  const res = await fetch(API_URL + path, {
    method: "DELETE",
  });
  return await res.json();
}
async function loginUser({ email, password }) {
  // Temporarily use test endpoint
  const resp = await fetch(API_URL + "/api/auth/login-test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await resp.json();

  if (data.accessToken) {
    const decoded = jwtDecode(data.accessToken); // ✅ dùng đúng cách
    if (decoded?.isAdmin !== true) {
      alert("Bạn không có quyền truy cập admin.");
      return { status: "forbidden" };
    }

    localStorage.setItem("adminUser", JSON.stringify(decoded)); // ✅ lưu vào localStorage
    localStorage.setItem("adminToken", data.accessToken);
  }

  return data;
}
async function deleteProduct(productID) {
  const resp = await fetch(`${API_URL}/api/products/${productID}`, {
    method: "DELETE",
    headers: {
      "x-access-token": localStorage.getItem("accessToken"), // nếu cần xác thực
    },
  });
  console.log("acc", accessToken);
  return await resp.json();
}

async function updateProduct(id, data) {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem("adminToken"),
    },
    body: JSON.stringify(data),
  });
  console.log("tokeennnn", localStorage.getItem("adminToken"));

  return await res.json();
}
// ✅ Thêm sản phẩm mới
async function addProduct(data) {
  const token = localStorage.getItem("adminToken");
  const res = await fetch(`${API_URL}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

async function getAll(path) {
  const token = localStorage.getItem("adminToken");
  const res = await fetch(API_URL + path, {
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token, // ✅ bắt buộc
    },
  });
  return await res.json();
}
async function getOrderDetail(orderId) {
  const token = localStorage.getItem("adminToken");
  const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  return await res.json();
}
async function putOrder(path, data) {
  const token = localStorage.getItem("adminToken");
  const res = await fetch(API_URL + path, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}
// ✅ Lấy tất cả người dùng
async function getUsers() {
  const token = localStorage.getItem("adminToken");
  const res = await fetch(`${API_URL}/api/users`, {
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  return await res.json();
}

// ✅ Lấy 1 người dùng theo ID
async function getUser(id) {
  const token = localStorage.getItem("adminToken");
  const res = await fetch(`${API_URL}/api/users/${id}`, {
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  return await res.json();
}

// ✅ Cập nhật user
async function updateUser(id, data) {
  const token = localStorage.getItem("adminToken");
  const res = await fetch(`${API_URL}/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

// ✅ Xoá user
async function deleteUser(id) {
  const token = localStorage.getItem("adminToken");
  const res = await fetch(`${API_URL}/api/users/${id}`, {
    method: "DELETE",
    headers: {
      "x-access-token": token,
    },
  });
  return await res.json();
}
async function updateUserAsAdmin(id, data) {
  const res = await fetch(`${API_URL}/api/users/admin/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem("adminToken"),
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}
async function getUserStats() {
  const res = await fetch(`${API_URL}/api/users/stats`, {
    headers: {
      "x-access-token": localStorage.getItem("adminToken"),
    },
  });
  return await res.json();
}
async function getOverviewStats() {
  const token = localStorage.getItem("adminToken");
  const headers = { "x-access-token": token };

  const [users, orders, products] = await Promise.all([fetch(`${API_URL}/api/users`, { headers }).then((res) => res.json()), fetch(`${API_URL}/api/orders`, { headers }).then((res) => res.json()), fetch(`${API_URL}/api/products`, { headers }).then((res) => res.json())]);

  const totalRevenue = Array.isArray(orders) ? orders.reduce((sum, o) => sum + (o.amount || 0), 0) : 0;

  return {
    userCount: users.length || 0,
    orderCount: orders.length || 0,
    productCount: products.length || 0,
    totalRevenue,
  };
}

export default {
  get,
  post,
  put,
  del,
  loginUser,
  deleteProduct,
  updateProduct,
  addProduct,
  getAll,
  getOrderDetail,
  putOrder,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserAsAdmin,
  getUserStats,
  getOverviewStats,
};
