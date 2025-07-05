import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "react-feather";
import clsx from "clsx";

import Input from "@/components/Input";
import api from "@/api";

export default function SearchAutocomplete() {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchText.trim()) {
        try {
          const results = await api.searchProducts(searchText);
          setSuggestions(results.slice(0, 6)); // chỉ lấy 6 gợi ý đầu
        } catch (err) {
          console.error("❌ Search error:", err);
        }
      } else {
        setSuggestions([]);
      }
    }, 300); // debounce 300ms

    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  const handleSelect = (product) => {
    setSuggestions([]);
    setSearchText("");
    navigate(`/products/${product._id}`);
  };

  return (
    <div className="relative w-full max-w-xs md:max-w-sm lg:max-w-md">
      <Input
        icon={<Search />}
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="bg-opacity-40"
      />

      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded shadow-md z-50 max-h-80 overflow-y-auto mt-1">
          {suggestions.map((product) => (
            <div
              key={product._id}
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(product)}
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-10 h-10 object-cover rounded mr-3"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-sm truncate">{product.title}</span>
                <span className="text-xs text-gray-500">{product.price.toLocaleString()} ₫</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
