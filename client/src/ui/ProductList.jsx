import React, { useContext } from 'react'

import Product from "@/components/Product"
import { CartContext } from "@/App"

export default function ProductList({ products, onAddToCart }) {
  const {cart} = useContext(CartContext)

  console.log("ProductList nhận được:", products);
  if (!products || products.length === 0) {
    console.log("Không có sản phẩm để hiển thị");
    return <div>No products found</div>;
  }

  return (
    <div className="flex flex-wrap justify-center">
      {products.map(product => (
        <Product
          key={product._id}
          imgSrc={product.img}           // Thay đổi từ image thành img
          title={product.title}          // Thêm title nếu cần
          price={product.price}
          onAddToCart={() => onAddToCart(product)}
        />          
      ))}
    </div>
  )
}