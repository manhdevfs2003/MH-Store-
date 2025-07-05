import React, { useContext, useEffect, useState } from "react"
import { ChevronDown } from "react-feather"
import { useLocation } from "react-router-dom"

import ProductList from "@/ui/ProductList"
import Container from "@/components/Container"
import Button from "@/components/Button"
import DropDown, { Select, Option } from "@/components/DropDown"
import useClickOutside from "@/hooks/useClickOutside"
import api from "../api"
import { CartContext, UserContext } from "@/App"

const sortOptions = [
  "popular",
  "new",
  "price: low to high",
  "price: high to low",
]
console.log("🔥 ProductsPage đã được render");

export default function ProductsPage() {
  const { cartDispatch } = useContext(CartContext)
  const { user } = useContext(UserContext)
  const query = new URLSearchParams(useLocation().search)

  const category = query.get("category")
  const search = query.get("search")

  const [products, setProducts] = useState([])
  const [sort, setSort] = useState(0)
  const [showSortOptions, setShowSortOptions] = useState(false)
  const dropDownRef = useClickOutside(() => setShowSortOptions(false))

  useEffect(() => {
    (async () => {
      try {
        let resp;
        if (search) {
          resp = await api.get(`/products/search?q=${search}`)
        } else {
          resp = await api.fetchProducts(category)
        }

        console.log("📦 Response:", resp)

        const data = Array.isArray(resp) ? resp : resp?.data || []

        if (Array.isArray(data)) {
          console.log("✅ Sản phẩm nhận được:", data.length)
          setProducts(data)
        } else {
          console.error("❌ Dữ liệu không đúng định dạng:", resp)
        }
      } catch (err) {
        console.error("❌ Lỗi khi gọi API:", err)
      }
    })()
  }, [category, search])

  useEffect(() => {
    console.log("Products state sau khi cập nhật:", products)
  }, [products])

  useEffect(() => sortProducts(sort), [sort])

  const sortProducts = (sortType) => {
    switch (sortType) {
      case 1:
        setProducts([...products].sort((a, b) => a.updatedAt - b.updatedAt))
        break
      case 2:
        setProducts([...products].sort((a, b) => a.price - b.price))
        break
      case 3:
        setProducts([...products].sort((a, b) => b.price - a.price))
        break
      default:
        return
    }
  }

  const addToCart = async (product, quantity = 1) => {
    if (user) {
      const resp = await api.addProductsToCart([{ productID: product._id, quantity }])
      if (resp.status === "ok") {
        cartDispatch({ type: "ADD_PRODUCTS", payload: [{ ...product, quantity }] })
      }
    } else {
      cartDispatch({ type: "ADD_PRODUCTS", payload: [{ ...product, quantity }] })
    }
  }

  return (
    <main>
      <Container
        heading={`Products${category ? " for: " + category : search ? " matching: " + search : ""}`}
        type="page"
      >
        <section className="flex justify-end">
          <div className="relative" ref={dropDownRef}>
            <span className="font-bold">Sort by:</span>
            <Button
              secondary
              onClick={() => setShowSortOptions((prev) => !prev)}
            >
              {sortOptions[sort]} <ChevronDown className="ml-2" />
            </Button>

            {showSortOptions && (
              <DropDown className="mt-10 inset-x-0" onClick={() => setShowSortOptions(false)}>
                <Select>
                  {sortOptions.map((option, i) => (
                    <Option key={option} onClick={() => setSort(i)}>
                      {option}
                    </Option>
                  ))}
                </Select>
              </DropDown>
            )}
          </div>
        </section>

        {products.length > 0 ? (
          <>
            <ProductList products={products} onAddToCart={addToCart} />
            <div className="text-center text-sm text-gray-400 mt-4">
              Hiển thị {products.length} sản phẩm
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 mt-8">
            Không tìm thấy sản phẩm nào.
          </div>
        )}
      </Container>
    </main>
  )
}
