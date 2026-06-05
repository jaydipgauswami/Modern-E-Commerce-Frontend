"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Card,
  Row,
  Col,
  Spin,
  Typography,
  Button,
  Space,
  Tag,
  Divider,
  Tooltip,
  message
} from "antd";
import {
  ShoppingCartOutlined,
  MinusOutlined,
  PlusOutlined,
  HeartOutlined,
  HeartFilled,
  ThunderboltOutlined
} from "@ant-design/icons";
import { useCart } from "../../context/CartContext";

const { Title, Paragraph, Text } = Typography;

export default function ProductDetailClient({ product }) {
  // Cart & Wishlist Context
  const { 
    addToCart, 
    wishlistItems = [], 
    handleWishlist, 
    handleBuyNow 
  } = useCart();

  // Buy state
  const [quantity, setQuantity] = useState(1);

  const unitPrice = Number(product?.price) || 0;
  const totalPrice = unitPrice * quantity;

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    message.success(`Added ${quantity} "${product.name}" to cart`);
  };

  // Memoize wishlist check for speed
  const isWishlisted = useMemo(() => {
    return wishlistItems.some((item) => item.id === product?.id);
  }, [wishlistItems, product]);

  // Wishlist toggle event with instant notice popups
  const onToggleWishlist = (e) => {
    e.stopPropagation();
    handleWishlist(product);
    // if (isWishlisted) {
    //   message.info(`Removed "${product.name}" from your wishlist`);
    // } else {
    //   message.success(`Added "${product.name}" to your wishlist!`);
    // }
  };

  // Loading Fallback
  if (!product) {
    return (
      <div className="h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Spin size="large" />
          <span className="text-gray-400 text-xs font-semibold">Opening Specifications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-50 to-indigo-50 min-h-screen flex items-center justify-center">
      
      <Card
        className="w-full max-w-5xl rounded-3xl border-none shadow-xl overflow-hidden bg-white"
        styles={{ body: { padding: "24px sm:36px" } }}
      >
        <Row gutter={[40, 32]} align="middle">
          
          {/* LEFT: Product Image Section */}
          <Col xs={24} md={12}>
            <motion.div
              whileHover={{ scale: 1.015 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-2xl border border-gray-100 shadow-sm"
            >
              <img
                src={product.image ? `http://localhost:5000/uploads/${product.image}` : "https://placehold.co/500x500?text=No+Image"}
                alt={product.name}
                onError={(e) => { e.target.src = "https://placehold.co/500x500?text=No+Image"; }}
                className="w-full h-[300px] sm:h-[450px] md:h-[500px] object-cover rounded-2xl"
              />
            </motion.div>
          </Col>

          {/* RIGHT: Product Metadata & Checkout Details */}
          <Col xs={24} md={12}>
            <Space orientation="vertical" size={20} className="w-full">
              
              {/* Brand Tag */}
              <Tag
                color="purple"
                className="border-none rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider w-fit"
              >
                {product.brand || "Generic Brand"}
              </Tag>

              {/* Product Title */}
              <div>
                <Title level={1} className="m-0 text-gray-900 font-extrabold text-2xl sm:text-3xl leading-snug">
                  {product.name}
                </Title>
              </div>

              {/* Price Details */}
              <div>
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Retail Price</span>
                <Text className="font-black text-3xl text-emerald-600 block mt-1">
                  ₹{unitPrice.toLocaleString("en-IN")}
                </Text>
              </div>

              {/* Description Details */}
              <div>
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">Description</span>
                <Paragraph className="text-gray-500 text-sm leading-relaxed m-0 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  {product.description || "This item has no write-up description logs."}
                </Paragraph>
              </div>

              <Divider className="my-1 border-gray-100" />

              {/* Quantity Select Segment */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Text className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Select Quantity</Text>
                
                <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-xl border border-gray-150 select-none">
                  <Button
                    shape="circle"
                    type="text"
                    icon={<MinusOutlined />}
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="flex items-center justify-center text-gray-500 hover:text-indigo-600 disabled:text-gray-300"
                  />
                  <Text className="font-extrabold text-base min-w-[24px] text-center text-gray-800">
                    {quantity}
                  </Text>
                  <Button
                    shape="circle"
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={handleIncrement}
                    className="flex items-center justify-center text-gray-500 hover:text-indigo-600"
                  />
                </div>
              </div>

              {/* Price Summary Breakdown Box */}
              <div className="bg-indigo-50/50 border border-indigo-150 p-4 rounded-xl flex justify-between items-center select-none">
                <div>
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Total Subtotal</span>
                  <span className="text-xl font-black text-indigo-600 mt-0.5 block">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wide">
                  {quantity} Unit(s) × ₹{unitPrice.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row items-stretch gap-3.5 pt-2">
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                  className="bg-indigo-600 hover:bg-indigo-700 border-none rounded-xl font-bold flex items-center justify-center gap-2 h-12 flex-grow order-2 sm:order-1"
                >
                  Add to Cart
                </Button>

                <Button
                  type="default"
                  size="large"
                  icon={<ThunderboltOutlined />}
                  onClick={() => handleBuyNow(product)}
                  className="bg-amber-500 hover:bg-amber-600 text-white hover:text-white border-none rounded-xl font-bold flex items-center justify-center gap-2 h-12 flex-grow order-1 sm:order-2"
                >
                  Buy Now
                </Button>

                <Tooltip title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}>
                  <Button
                    size="large"
                    shape="circle"
                    icon={isWishlisted ? <HeartFilled className="text-red-500" /> : <HeartOutlined className="text-gray-600 hover:text-red-500" />}
                    onClick={onToggleWishlist}
                    className={`h-12 w-12 flex items-center justify-center border rounded-xl order-3 ${
                      isWishlisted ? "bg-red-50 border-red-200" : "bg-white border-gray-200"
                    }`}
                  />
                </Tooltip>
              </div>
              
            </Space>
          </Col>
        </Row>
      </Card>
      
    </div>
  );
}