"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";


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
   Popconfirm,  

} from "antd";

import {
  ShoppingCartOutlined,
  MinusOutlined,
  PlusOutlined,
  HeartOutlined,
  HeartFilled,
  ThunderboltOutlined,
  
} from "@ant-design/icons";

import { useCart } from "../../context/CartContext";

const { Title, Paragraph, Text } = Typography;

export default function ProductDetailClient({
  product,
}) {
  const { addToCart ,  wishlistItems,
setWishlistItems, handleWishlist,handleBuyNow , } = useCart();

  const [quantity, setQuantity] =
    useState(1);

  const unitPrice =
    Number(product.price) || 0;

  const totalPrice =
    unitPrice * quantity;

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) =>
      prev > 1 ? prev - 1 : 1
    );
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);

   
  };
   if (!product) {
      return (
        <div
          style={{
            height: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin size="large" />
        </div>
      );
    }
  

  return (
    <div
      style={{
        minHeight: "0vh",
        background:
          "linear-gradient(to right, #f8fafc, #eef2ff)",
        padding: "0px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Toaster position="top-right" />

      <Card
        variant="outlined"
        style={{
          width: "100%",
          maxWidth: "1000px",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow:
            "0 10px 40px rgba(0,0,0,0.08)",
        }}
        styles={{
          body: {
            padding: "20px",
          },
        }}
      >
        <Row
          gutter={[40, 40]}
          align="middle"
        >

                

          {/* LEFT IMAGE */}
          <Col xs={24} md={12}>
            <motion.div
              whileHover={{
                scale: 1.03,
              }}
              transition={{
                duration: 0.3,
              }}
            >

              {/* WISHLIST BUTTON */}
<div
  style={{
    position: "relative",
    width: "100%",
    marginTop: "10px",
  }}
>
  <Popconfirm
    title={
            wishlistItems?.some(
  (item) => item.id === product.id
)
        ? "Remove from Wishlist"
        : "Add to Wishlist"
    }
    description={
          wishlistItems?.some(
  (item) => item.id === product.id
)
        ? "Do you want to remove this item?"
        : "Do you want to add this item?"
    }
    okText="Done"
    cancelText="Cancel"
    onConfirm={(e) => {
      e?.stopPropagation();
      handleWishlist(product);
    }}
    onCancel={(e) => {
      e?.stopPropagation();
    }}
    onPopupClick={(e) =>
      e.stopPropagation()
    }
  >
    <Button
      size="large"
      block
      icon={
              wishlistItems?.some(
  (item) => item.id === product.id
) ? (
          <HeartFilled />
        ) : (
          <HeartOutlined />
        )
      }
      style={{
        height: "54px",
        borderRadius: "14px",
        fontSize: "17px",
        fontWeight: 600,
        border:
                wishlistItems?.some(
  (item) => item.id === product.id
)
            ? "1px solid #ff4d4f"
            : "1px solid #d9d9d9",
        background:
                wishlistItems?.some(
  (item) => item.id === product.id
)
            ? "#fff1f0"
            : "#fff",
        color:
                wishlistItems?.some(
  (item) => item.id === product.id
)
            ? "#ff4d4f"
            : "#000",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {      wishlistItems?.some(
  (item) => item.id === product.id
)
        ? "Wishlisted"
        : "Add To Wishlist"}

      {/* PLUS ICON */}
      {!      wishlistItems?.some(
  (item) => item.id === product.id
) && (
        <span
          style={{
            position: "absolute",
            top: "10px",
            right: "14px",
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            background: "#1677ff",
            color: "#fff",
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          +
        </span>
      )}
    </Button>
  </Popconfirm>
</div>
              <img
                src={
                  product.image
                    ? `http://localhost:5000/uploads/${product.image}`
                    : null
                }
                alt={product.name}
                style={{
                  width: "100%",
                  height: "500px",
                  objectFit: "cover",
                  borderRadius: "24px",
                }}
              />
            </motion.div>
          </Col>

          {/* RIGHT CONTENT */}
          <Col xs={24} md={12}>
            <Space
              orientation="vertical"
              size={18}
              style={{ width: "100%" }}
            >
              {/* BRAND */}
              <Tag
                color="purple"
                style={{
                  width: "fit-content",
                  padding:
                    "6px 16px",
                  fontSize: "15px",
                  borderRadius: "30px",
                  fontWeight: 600,
                }}
              >
                {product.brand ||
                  "No Brand"}
              </Tag>

              {/* TITLE */}
              <Title
                level={1}
                style={{
                  margin: 0,
                  fontSize: "42px",
                  lineHeight: 1.2,
                }}
              >
                {product.name}
              </Title>

              {/* PRICE */}
              <Text
                strong
                style={{
                  fontSize: "36px",
                  color: "#16a34a",
                }}
              >
                ₹
                {unitPrice.toLocaleString()}
              </Text>

              {/* DESCRIPTION */}
              <Paragraph
                style={{
                  fontSize: "17px",
                  color: "#555",
                  lineHeight: 1.8,
                  marginBottom: 0,
                }}
              >
                {product.description}
              </Paragraph>
              <Divider />
              {/* QUANTITY */}
              <div>
                <Text
                  strong
                  style={{
                    fontSize: "18px",
                  }}
                >
                  Quantity
                </Text>

                <div
                  style={{
                    display: "flex",
                    alignItems:
                      "center",
                    gap: "16px",
                    marginTop: "16px",
                  }}
                >
                  <Button
                    shape="circle"
                    icon={
                      <MinusOutlined />
                    }
                    onClick={
                      handleDecrement
                    }
                  />

                  <Text
                    strong
                    style={{
                      fontSize: "22px",
                      minWidth: "30px",
                      textAlign:
                        "center",
                    }}
                  >
                    {quantity}
                  </Text>

                  <Button
                    shape="circle"
                    icon={
                      <PlusOutlined />
                    }
                    onClick={
                      handleIncrement
                    }
                  />
                </div>
              </div>

              {/* TOTAL */}
              <div>
                <Text
                  strong
                  style={{
                    fontSize: "18px",
                    color: "#666",
                  }}
                >
                  Total Price
                </Text>

                <Title
                  level={2}
                  style={{
                    margin:
                      "5px 0 0",
                    color: "#1677ff",
                  }}
                >
                  ₹
                  {totalPrice.toLocaleString()}
                </Title>
              </div>

              {/* BUTTON */}
              <Button
                type="primary"
                size="large"
                icon={
                  <ShoppingCartOutlined />
                }
                onClick={
                  handleAddToCart
                }
                style={{
                  height: "54px",
                  borderRadius:
                    "14px",
                  fontSize: "17px",
                  fontWeight: 600,
                  marginTop: "10px",
                }}
                block
              >
                Add To Cart
              </Button>

               <Button
                  type=""
                  size="large"
                  block
                  icon={<ThunderboltOutlined />}
                  onClick={() => handleBuyNow()}
                  style={{
                    fontWeight: "600",
                  }}
                >
                  Buy Now
                </Button>
               
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
}