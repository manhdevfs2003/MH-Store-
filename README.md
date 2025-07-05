# FullFashionSellerWeb 👗

<<<<<<< HEAD
Một hệ thống thương mại điện tử thời trang hoàn chỉnh được xây dựng với **MERN Stack** (MongoDB, Express.js, React, Node.js).

## 📋 Tổng quan

FullFashionSellerWeb là một nền tảng bán hàng thời trang trực tuyến với giao diện hiện đại, tích hợp đầy đủ các tính năng cần thiết cho cả khách hàng và quản trị viên.

## 🏗️ Kiến trúc hệ thống

```
FullFashionSellerWeb/
├── 🖥️ client/          # Frontend khách hàng (React + Vite)
├── 👨‍💼 admin-panel/     # Admin Dashboard (React + Vite)
├── ⚙️ api/             # Backend API (Node.js + Express)
└── 📄 README.md
```

## ✨ Tính năng chính

### 🛍️ Dành cho khách hàng:

- **Duyệt sản phẩm** theo danh mục (nam, nữ, unisex)
- **Tìm kiếm & lọc** sản phẩm nâng cao
- **Giỏ hàng** với lưu trữ local storage
- **Đăng ký/Đăng nhập** tài khoản
- **Thanh toán** tích hợp Stripe
- **Theo dõi đơn hàng** và lịch sử mua hàng
- **Responsive design** cho mọi thiết bị

### 👨‍💼 Dành cho Admin:

- **Dashboard** thống kê tổng quan
- **Quản lý sản phẩm** (CRUD operations)
- **Quản lý đơn hàng** với cập nhật trạng thái
- **Quản lý người dùng** và phân quyền
- **Báo cáo** doanh thu và analytics
- **Giao diện** hiện đại với Bootstrap

## 🛠️ Công nghệ sử dụng

### Backend:

- **Node.js** + **Express.js**
- **MongoDB** với **Mongoose ODM**
- **JWT** cho authentication
- **Stripe** cho payment processing
- **Bcrypt** cho hash password
- **Joi** cho data validation

### Frontend:

- **React 18** với **Vite**
- **React Router** cho navigation
- **Context API** cho state management
- **Axios** cho API calls
- **Tailwind CSS** + **WindiCSS**
- **Bootstrap** (Admin panel)

### Database:

- **MongoDB Atlas** (Cloud database)

## 🚀 Hướng dẫn cài đặt

### 1. Clone repository

```bash
git clone https://github.com/your-username/FullFashionSellerWeb.git
cd FullFashionSellerWeb
```

### 2. Cài đặt Backend

```bash
cd api
npm install
```

Tạo file `.env` trong thư mục `api`:

```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/fashionDB
JWT_SECRET=your-jwt-secret-key
STRIPE_SECRET=sk_test_your-stripe-secret-key
PORT=5000
```

### 3. Cài đặt Frontend (Client)

```bash
cd client
npm install
```

Tạo file `.env` trong thư mục `client`:

```env
VITE_API_URL=http://localhost:5000
```

### 4. Cài đặt Admin Panel

```bash
cd admin-panel
npm install
```

Tạo file `.env` trong thư mục `admin-panel`:

```env
VITE_API_URL=http://localhost:5000
```

## 🏃‍♂️ Chạy ứng dụng

### Khởi động Backend:

```bash
cd api
npm run dev
# Server chạy tại http://localhost:5000
```

### Khởi động Client:

```bash
cd client
npm run dev
# Client chạy tại http://localhost:3000
```

### Khởi động Admin Panel:

```bash
cd admin-panel
npm run dev
# Admin chạy tại http://localhost:5174
```

## 🌐 Truy cập ứng dụng

### 🛍️ Client (Khách hàng):

**URL:** [http://localhost:3000](http://localhost:3000)

- Trang chủ với carousel sản phẩm
- Danh mục sản phẩm (Nam/Nữ/Unisex)
- Giỏ hàng và thanh toán
- Tài khoản và đơn hàng

### 👨‍💼 Admin Panel:

**URL:** [http://localhost:5174](http://localhost:5174)

**Tài khoản Admin:**

- **Email:** `admintest@gmail.com`
- **Mật khẩu:** `123456`

**Tính năng admin:**

- Dashboard thống kê
- Quản lý sản phẩm
- Quản lý đơn hàng
- Quản lý người dùng

## 📁 Cấu trúc thư mục chi tiết

```
api/
├── models/          # MongoDB schemas
├── routes/          # API endpoints
├── middlewares/     # Auth & validation
└── index.js        # Server entry point

client/
├── src/
│   ├── components/  # Reusable components
│   ├── pages/       # Page components
│   ├── ui/          # UI components
│   ├── hooks/       # Custom hooks
│   └── reducers/    # State management
└── public/

admin-panel/
├── src/
│   ├── components/  # Admin components
│   ├── pages/       # Admin pages
│   └── api.js       # API configuration
└── public/
```

## 🗄️ Database Schema

### Products:

```javascript
{
  title: String,
  desc: String,
  img: String,
  categories: [String],
  size: [String],
  color: [String],
  price: Number,
  inStock: Boolean
}
```

### Users:

```javascript
{
  username: String,
  email: String,
  password: String, // hashed
  isAdmin: Boolean
}
```

### Orders:

```javascript
{
  userID: ObjectId,
  products: [{
    productID: ObjectId,
    quantity: Number
  }],
  amount: Number,
  address: Object,
  status: String
}
```

## 🔐 Authentication

- **JWT tokens** cho session management
- **Bcrypt hashing** cho passwords
- **Middleware protection** cho protected routes
- **Admin role-based** access control

## 💳 Payment Integration

- **Stripe** payment gateway
- **Secure checkout** process
- **Order confirmation** và email notifications

## 📱 Responsive Design

- **Mobile-first** approach
- **Tailwind CSS** utilities
- **Cross-browser** compatibility
- **Touch-friendly** interface

## 🐛 Known Issues

- Cần cấu hình Stripe keys để thanh toán hoạt động
- Upload hình ảnh sản phẩm chưa tối ưu
- Cần thêm email service cho notifications

## 🚀 Deployment

### Production Setup:

1. Deploy backend lên **Heroku/Railway/Render**
2. Deploy frontend lên **Vercel/Netlify**
3. Cấu hình **MongoDB Atlas** production
4. Setup **domain** và **SSL certificates**

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Team

- **Developer:** Your Name
- **Email:** your.email@example.com
- **GitHub:** [@your-username](https://github.com/your-username)

## 📞 Support

Nếu bạn gặp vấn đề hoặc có câu hỏi, vui lòng:

- Tạo **Issue** trên GitHub
- Liên hệ qua email
- Join Discord server (nếu có)

---
=======

## Front-end
- [React](https://es.reactjs.org/) - Front-End JavaScript library
- [Windi CSS](https://windicss.org/) - Next generation utility-first CSS framework
- [Feather Icons](https://feathericons.com/) - Simply beautiful open source icons
- [Vite](https://vitejs.dev/) - Frontend Tooling
>>>>>>> f2b171ca723e543d145c1759a865e31019e356f4

⭐ **Nếu project này hữu ích, hãy cho một star!** ⭐

> Make sure you have [mongodb](https://www.mongodb.com/try/download/community) & [nodejs](https://nodejs.org/) installed on your system before proceeding.

1. Clone this repo

```bash
git clone https://github.com/nimone/Fashion-Store && cd Fashion-Store
```

2. Install project dependecies

```bash
cd ./api && npm install
cd ./client && npm install
```

3. Start development servers (api & client) with the provided script `rundev.sh`

```bash
bash rundev.sh
```

> Or, start them manually by `npm run dev`
