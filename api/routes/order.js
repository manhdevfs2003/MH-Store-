const router = require("express").Router();
const ObjectId = require("mongoose").Types.ObjectId;
const { celebrate } = require("celebrate");

const Order = require("../models/Order.model");
const { order: orderSchema } = require("../models/schema");
const { verifyToken, verifyAuthorization, verifyAdminAccess } = require("../middlewares/verifyAuth");

// Get all orders - admin only
router.get("/", verifyAdminAccess, celebrate({ query: orderSchema.query }), async (req, res) => {
  const query = req.query;

  try {
    let orders;
    if (query.status) {
      orders = await Order.find({ status: query.status });
    } else {
      orders = await Order.find();
    }

    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json(orderResponse.unexpectedError);
  }
});

// Create a new order - authenticated user
router.post("/", verifyToken, celebrate({ body: orderSchema.new }), async (req, res) => {
  const { products, amount, address } = req.body;

  try {
    const order = await Order.create({
      userID: ObjectId(req.user.uid),
      products,
      amount,
      address,
    });
    return res.json({
      ...orderResponse.orderCreated,
      orderID: order._id,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(orderResponse.unexpectedError);
  }
});

// Get order statistics - admin only
router.get("/stats", verifyAdminAccess, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(date.setMonth(lastMonth.getMonth() - 1));

  try {
    const data = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          sales: { $sum: "$sales" },
        },
      },
    ]);
    res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json(orderResponse.unexpectedError);
  }
});

// Get an order - authorized user & admin only
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const cleanId = req.params.id.trim(); // ✅ loại bỏ dấu xuống dòng hoặc khoảng trắng

    let order;

    if (req.user.isAdmin) {
      order = await Order.findById(cleanId);
    } else {
      order = await Order.findOne({
        _id: ObjectId(cleanId),
        userID: ObjectId(req.user.uid),
      });
    }

    if (!order) {
      return res.status(404).json(orderResponse.orderNotFound);
    }

    order = await order.populate({
      path: "products.productID",
      select: ["title", "price", "image"],
    });

    return res.json({ status: "ok", order });
  } catch (err) {
    console.error("❌ Lỗi BE khi GET /orders/:id:", err);
    return res.status(500).json(orderResponse.unexpectedError);
  }
});

// Update an order - admin only
router.put("/:id", verifyAdminAccess, celebrate({ body: orderSchema.update }), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ status: "error", message: "Order not found" });
    }

    const currentStatus = order.status;
    const nextStatus = req.body.status;

    // ✅ Danh sách trạng thái hợp lệ cho mỗi trạng thái hiện tại
    const allowedTransitions = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["shipped", "cancelled"],
      shipped: ["in transit"],
      "in transit": ["delivered", "returned"],
      delivered: ["completed"],
    };

    // ❌ Nếu chuyển trạng thái không hợp lệ
    if (!allowedTransitions[currentStatus]?.includes(nextStatus)) {
      return res.status(400).json({
        status: "error",
        message: `❌ Không thể chuyển từ "${currentStatus}" sang "${nextStatus}".`,
      });
    }

    // ✅ Nếu hợp lệ thì cập nhật
    await Order.findByIdAndUpdate(req.params.id, { $set: { status: nextStatus } }, { new: true });
    return res.json(orderResponse.orderUpdated);
  } catch (err) {
    console.error("❌ Lỗi cập nhật trạng thái đơn hàng:", err);
    return res.status(500).json(orderResponse.unexpectedError);
  }
});

// Delete an order - admin only
router.delete("/:id", verifyAdminAccess, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json(orderResponse.orderDeleted);
  } catch (err) {
    console.log(err);
    return res.status(500).json(orderResponse.unexpectedError);
  }
});

// Get user orders - authorized user & admin only
router.get("/user/:id", verifyAuthorization, async (req, res) => {
  try {
    let orders = await Order.find({ userID: ObjectId(req.params.id) }).populate({
      path: "products.productID",
      select: ["title", "image"],
    });
    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json(orderResponse.unexpectedError);
  }
});

const orderResponse = {
  orderCreated: {
    status: "ok",
    message: "order has been created",
  },
  orderUpdated: {
    status: "ok",
    message: "order has been updated",
  },
  orderDeleted: {
    status: "ok",
    message: "order has been deleted",
  },
  orderNotFound: {
    status: "error",
    message: "order not found",
  },
  unexpectedError: {
    status: "error",
    message: "an unexpected error occurred",
  },
};

module.exports = router;
