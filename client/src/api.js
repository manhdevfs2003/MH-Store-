const API_URL = import.meta.env.VITE_API_URL;

console.log("API_URL value:", import.meta.env.VITE_API_URL);

function setAccessToken(token) {
  localStorage.setItem("token", token);
}
function getAccessToken() {
  return localStorage.getItem("token");
}

function setUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}
function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

async function registerUser({ fullname, email, password }) {
  const resp = await fetch(API_URL + "/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fullname, email, password }),
  });
  return await resp.json();
}

async function loginUser({ email, password }) {
  const resp = await fetch(API_URL + "/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await resp.json();

  if (data.accessToken) {
    setAccessToken(data.accessToken);
    await fetchUserDetails();
  }
  return data;
}

function logoutUser() {
  localStorage.clear();
}

async function createUserCart(products) {
  const resp = await fetch(API_URL + "/carts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": getAccessToken(),
    },
    body: JSON.stringify(products.length ? { products } : {}),
  });
  return await resp.json();
}

async function getUserCart() {
  const userID = getUser()._id;
  console.log("UserID:", userID);
  const token = getAccessToken();

  console.log("Access Token:", token); // 👈 dòng cần thêm để xem token

  const resp = await fetch(API_URL + "/carts/" + userID, {
    headers: {
      "x-access-token": getAccessToken(),
    },
  });
  console.log("Response:", resp);
  const cart = await resp.json();
  console.log("Cart:", cart);
  if (cart.products) {
    cart.products = cart.products.map((product) => ({
      id: product.productID._id,
      title: product.productID.title,
      price: product.productID.price,
      image: product.productID.image,
      quantity: product.quantity,
    }));
  }
  console.log("Cart:", cart);
  return cart;
}

async function addProductsToCart(products) {
  const userID = getUser()._id;
  const sanitizedProducts = products.map((p) => ({
    productID: String(p.productID || p.id), // fallback nếu gọi từ sản phẩm FE
    quantity: p.quantity || 1,
  }));

  const resp = await fetch(API_URL + "/carts/" + userID, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": getAccessToken(),
    },
    body: JSON.stringify({ products: sanitizedProducts }),
  });
  console.log("Đang gửi addProductsToCart:", products);

  return await resp.json();
}

async function removeProductFromCart(productID) {
  return await patchCart(productID, 0);
}

async function patchCart(productID, quantity) {
  const userID = getUser()._id;
  const resp = await fetch(API_URL + "/carts/" + userID, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": getAccessToken(),
    },
    body: JSON.stringify({ productID, quantity }),
  });
  return await resp.json();
}

async function clearCart() {
  const resp = await fetch(API_URL + "/carts/clear", {
    method: "POST",
    headers: {
      "x-access-token": getAccessToken(),
    },
  });
  return await resp.json();
}

async function fetchUserDetails() {
  const resp = await fetch(API_URL + "/users/me", {
    headers: {
      "x-access-token": getAccessToken(),
    },
  });
  const { status, user } = await resp.json();
  if (status == "ok") {
    if (!user.avatarSrc) {
      user.avatarSrc = `https://avatars.dicebear.com/api/initials/${user.fullname}.svg`;
    }
    setUser(user);
  }
  return { status, user };
}

async function fetchProducts(category, newArrivals = false) {
  const requestUrl = API_URL + "/products?" + `new=${newArrivals ? "true" : "false"}${category ? "&category=" + category : ""}`;

  console.log("Đang gọi API:", requestUrl);

  try {
    const resp = await fetch(requestUrl);
    console.log("API status:", resp.status);
    const data = await resp.json();
    console.log("API response:", data);
    return data;
  } catch (error) {
    console.error("Lỗi kết nối API:", error);
    return { status: "error", message: error.message };
  }
}

async function fetchProduct(id) {
  const resp = await fetch(API_URL + "/products/" + id);
  return await resp.json();
}

async function proceedCheckout() {
  const resp = await fetch(API_URL + "/checkout/payment", {
    headers: {
      "Content-Type": "application/json",
      "x-access-token": getAccessToken(),
    },
  });
  return await resp.json();
}

// on production create the order using stripe webhooks
async function createOrder(products, amount, address) {
  const resp = await fetch(API_URL + "/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": getAccessToken(),
    },
    body: JSON.stringify({
      products: products.map((p) => ({ productID: p.id, quantity: p.quantity })),
      amount,
      address,
    }),
  });
  return await resp.json();
}

async function fetchAllOrders() {
  const userID = getUser()._id;
  const resp = await fetch(API_URL + "/orders/user/" + userID, {
    headers: {
      "x-access-token": getAccessToken(),
    },
  });
  return await resp.json();
}

async function fetchOrderDetails(orderID) {
  const resp = await fetch(API_URL + "/orders/" + orderID, {
    headers: {
      "x-access-token": getAccessToken(),
    },
  });
  return await resp.json();
}
async function get(url) {
  const resp = await fetch(API_URL + url);
  return await resp.json();
}

async function searchProducts(q) {
  return await get(`/products/search?q=${encodeURIComponent(q)}`);
}

export default {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  fetchUserDetails,
  fetchProducts,
  fetchProduct,
  createUserCart,
  getUserCart,
  addProductsToCart,
  removeProductFromCart,
  patchCart,
  clearCart,
  proceedCheckout,
  createOrder,
  fetchAllOrders,
  fetchOrderDetails,
  get, // ✅ thêm dòng này
  searchProducts,
};
