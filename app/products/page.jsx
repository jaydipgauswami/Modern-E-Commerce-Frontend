"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter ,  } from "next/navigation";
import { useSearchParams}  from "next/navigation";

import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import {
  Row,
  Col,
  Card,
  Button,
  Spin,
  Empty,
  Input,
  Select,
  Typography,
  message,
  Tag,
  Badge
} from "antd";
import {
  ShoppingCartOutlined,
  SearchOutlined,
  HeartOutlined,
  HeartFilled,
  ThunderboltOutlined,
  ReloadOutlined
} from "@ant-design/icons";

const { Meta } = Card;
const { Text, Paragraph, Title } = Typography;
const { Option } = Select;

export default function ProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
 
   useEffect(() => {
  const search = searchParams.get("search") || "";
  setSearchText(search);
}, [searchParams]);

const [searchText, setSearchText] =
  useState("");
  const { 
    addToCart, 
    wishlistItems = [], 
    handleWishlist, 
    handleBuyNow ,
    removeFromWishlist
  } = useCart();
  
  // Products states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState("all");
  // const [searchText, setSearchText] = useState("");
  const [sortType, setSortType] = useState("latest");

  // Fetch Products + Categories on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
    const token = localStorage.getItem("token");
      // Fetch Products
      const productRes = await fetch("http://localhost:5000/api/products/getproducts" , 
          {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      const productData = await productRes.json();
      const categoryRes = await fetch("http://localhost:5000/api/catagories" , 
         {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }  
      );
      const categoryData = await categoryRes.json();

      setProducts(productData.products || []);
      setCategories(categoryData.categories || []);
    } catch (error) {
      console.error("Failed to load catalog data", error);
      toast.error("Failed to load store products");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== "all") {
      list = list.filter(
        (p) => Number(p.category_id) === Number(selectedCategory)
      );
    }
    console.log("Search Text:", searchText);
  console.log("First Product:", products[0]);

   
   if (searchText.trim()) {
  const search = searchText.toLowerCase();

  list = list.filter((p) =>
    
    p.name?.toLowerCase().includes(search) ||
    p.brand?.toLowerCase().includes(search) ||
    p.description?.toLowerCase().includes(search) ||
    p.category_name?.toLowerCase().includes(search)
  );
}

  
    if (sortType === "priceLow") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortType === "priceHigh") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortType === "latest") {
      list.sort((a, b) => b.id - a.id);
    }

    return list;
  }, [products, selectedCategory, searchText, sortType]);

  // Wishlist toggle handler with satisfying instant feedback notices
 const onToggleWishlist = async (e, product) => {
  e.stopPropagation();
  await handleWishlist(product);
};

  // Handle direct cart adds
  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product, 1);
  };
   console.log(
    wishlistItems.map((item) => ({
      id: item.id,
      product_id: item.product_id,
    }))
  );


  // Loading indicator overlay
  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Spin size="large" />
          <span className="text-gray-400 text-xs font-semibold">loading....</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      
      {/* Decorative Catalog Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl p-6 sm:p-8 mb-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Title level={2} style={{ margin: 0, color: "#fff", fontWeight: 800 }}>
            Discover Our Collection
          </Title>
          <Paragraph style={{ margin: "8px 0 0", color: "#e0e7ff", fontSize: "14px" }} className="max-w-xl">
Shop premium products with confidence. Enjoy quality, convenience, secure payments, and fast delivery—all in one place.          </Paragraph>
        </div>
        <div className="flex-shrink flex items-center gap-3 w-full sm:w-auto">
          <Badge count={wishlistItems.length} showZero color="#ff4d4f" className="w-full sm:w-auto">
            <Button 
              icon={<HeartFilled className="text-red-500" />} 
              onClick={() => router.push("/wishlist")}
              className="bg-white/10 hover:bg-white/20 text-white border-none rounded-xl h-11 px-4 flex items-center justify-center gap-2 w-full sm:w-auto font-bold"
            >
              My Wishlist
            </Button>
          </Badge>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchData}
            className="bg-white/10 hover:bg-white/20 text-white border-none rounded-xl h-11 w-11 flex items-center justify-center"
          />
        </div>
      </div>

      {/* Horizontal Swipeable Category Pill Navigation (Mobile Friendly) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide select-none border-b border-gray-100">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
            selectedCategory === "all" 
              ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" 
              : "bg-white text-gray-500 border-gray-200 hover:border-indigo-400"
          }`}
        >
          All Products
        </button>
        {categories.map((cat) => {
          const isActive = Number(selectedCategory) === Number(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" 
                  : "bg-white text-gray-500 border-gray-200 hover:border-indigo-400"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Responsive Filter controls card */}
      <Card
        className="shadow-sm border-gray-200 rounded-xl mb-6"
        styles={{ body: { padding: "16px" } }}
      >
        <Row gutter={[16, 16]} align="middle">
          {/* Search field */}
          <Col xs={24} md={14}>
            <Input
              size="large"
              placeholder="Search store products..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={(e) =>  
               { 
                setSearchText(e.target.value)}}
              allowClear
              className="rounded-lg h-11 flex items-center"
            />
          </Col>
          
          {/* Price Sorting Select */}
          <Col xs={24} sm={12} md={5}>
            <Select
              size="large"
              value={sortType}
              onChange={(val) => setSortType(val)}
              className="w-full h-11"
            >
              <Option value="latest">Sort By: Latest</Option>
              <Option value="priceLow">Price: Low to High</Option>
              <Option value="priceHigh">Price: High to Low</Option>
            </Select>
          </Col>
          
          {/* Backup Category Dropdown */}
          <Col xs={24} sm={12} md={5}>
            <Select
              size="large"
              value={selectedCategory}
              onChange={(val) => setSelectedCategory(val)}
              className="w-full h-11"
            >
              <Option value="all">All Categories</Option>
              {categories.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Products catalog records */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200">
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            description={<span className="text-gray-400 font-semibold">No Products Found matching your search criteria</span>} 
          />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredProducts.map((p) => {
       const isWishlisted = wishlistItems.some(
  (item) => Number(item.id) === Number(p.id)
);
            return (
              <Col xs={24} sm={12} md={8} lg={6} key={p.id}>
                <Card
                  hoverable
                  className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col justify-between"
                  styles={{ body: { padding: "14px", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" } }}
                  cover={
                    <div
                      onClick={() => router.push(`/products/${p.id}`)}
                      className="cursor-pointer relative overflow-hidden group h-60 bg-gray-50 flex items-center justify-center p-3"
                    >
                      {/* Floating Wishlist Heart toggle (instant action) */}
                      <div
                        onClick={(e) => onToggleWishlist(e, p)}
                        className="absolute top-3 right-3 z-10 cursor-pointer w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                      >
                {isWishlisted ? (
  <HeartFilled
    style={{
      color: "red",
      fontSize: "20px",
    }}
  />
) : (
  <HeartOutlined
    style={{
      color: "gray",
      fontSize: "20px",
    }}
  />
)}
                      </div>

                      {/* Product Image cover with zoom transition */}
                      <img
                        alt={p.name}
                        src={`http://localhost:5000/uploads/${p.image}`}
                        onError={(e) => { e.target.src = "https://placehold.co/240x240?text=No+Image"; }}
                        className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  }
                >
                  <div className="flex-grow flex flex-col justify-between min-h-[140px] mb-4">
                    <div>
                      {/* Brand Label tag */}
                      <Tag color="purple" className="border-none rounded-full px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider mb-2">
                        {p.brand || "Generic"}
                      </Tag>
                      
                      {/* Product Title */}
                      <h3 
                        onClick={() => router.push(`/products/${p.id}`)}
                        className="font-extrabold text-gray-800 text-base leading-snug hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1 mb-1"
                      >
                        {p.name}
                      </h3>
                      
                      {/* Description */}
                      <Paragraph 
                        ellipsis={{ rows: 2 }}
                        className="text-xs text-gray-400 mt-1 mb-2 leading-relaxed"
                      >
                        {p.description || "No description logs registered."}
                      </Paragraph>
                    </div>

                    {/* Unit Retail Price */}
                    <div>
                      <span className="text-xs text-gray-400 block tracking-wide uppercase font-semibold">Retail Price</span>
                      <Text className="font-extrabold text-lg text-emerald-600 block mt-0.5">
                        ₹{Number(p.price).toLocaleString("en-IN")}
                      </Text>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      onClick={(e) => handleAddToCart(e, p)}
                      className="bg-indigo-600 hover:bg-indigo-700 border-none rounded-lg font-bold flex items-center justify-center text-xs h-9"
                    >
                      Add to Cart
                    </Button>
                    <Button
                      icon={<ThunderboltOutlined />}
                      onClick={(e) => { e.stopPropagation(); handleBuyNow(p); }}
                      className="bg-amber-500 hover:bg-amber-600 text-white hover:text-white border-none rounded-lg font-bold flex items-center justify-center text-xs h-9"
                    >
                      Buy Now
                    </Button>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

    </div>
  );
}