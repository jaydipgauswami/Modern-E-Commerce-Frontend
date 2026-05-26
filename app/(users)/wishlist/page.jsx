"use client";

import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Empty,
  Tag,
  message,
  Popconfirm,
} from "antd";

import {
  HeartFilled,
  DeleteOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

export default function WishlistPage() {
  const {
    wishlistItems,
    setWishlistItems,
    addToCart,
  } = useCart();

  // REMOVE ITEM
  const removeWishlistItem = (id) => {
    setWishlistItems(
      wishlistItems.filter(
        (item) => item.id !== id
      )
    );

    message.warning("Removed from Wishlist");
  };

  // MOVE TO CART
  const handleMoveToCart = (product) => {
    addToCart(product, 1);

    setWishlistItems(
      wishlistItems.filter(
        (item) => item.id !== product.id
      )
    );

    message.success("Added to Cart");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to right, #f8fafc, #eef2ff)",
        padding: "24px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
          marginBottom: "30px",
        }}
      >
        <div>
          <Title
            level={2}
            style={{
              margin: 0,
              fontWeight: 700,
            }}
          >
            My Wishlist
          </Title>

          <Text type="secondary">
            {wishlistItems.length} saved items
          </Text>
        </div>

        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow:
              "0 4px 14px rgba(0,0,0,0.12)",
          }}
        >
          <HeartFilled
            style={{
              color: "#ff4d4f",
              fontSize: "28px",
            }}
          />
        </div>
      </div>

      {/* EMPTY UI */}
      {wishlistItems.length === 0 ? (
        <Card
          style={{
            borderRadius: "24px",
            padding: "30px",
            border: "none",
            boxShadow:
              "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text
                style={{
                  fontSize: "18px",
                }}
              >
                Your Wishlist is Empty
              </Text>
            }
          />
        </Card>
      ) : (
        <Row gutter={[24, 24]}>
          {wishlistItems.map((item) => (
            <Col
              xs={24}
              sm={12}
              md={8}
              lg={6}
              key={item.id}
            >
              <motion.div
                whileHover={{
                  y: -6,
                }}
                transition={{
                  duration: 0.25,
                }}
              >
                <Card
                  hoverable
                  style={{
                    borderRadius: "22px",
                    overflow: "hidden",
                    border: "none",
                    height: "100%",
                    background: "#fff",
                    boxShadow:
                      "0 6px 20px rgba(0,0,0,0.08)",
                  }}
                  styles={{
                    body: {
                      padding: "16px",
                    },
                  }}
                  cover={
                    <div
                      style={{
                        position: "relative",
                        padding: "10px",
                      }}
                    >
                      {/* REMOVE ICON */}
                      <Popconfirm
                        title="Remove from Wishlist"
                        description="Do you want to remove this item?"
                        okText="Done"
                        cancelText="Cancel"
                        onConfirm={() =>
                          removeWishlistItem(item.id)
                        }
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: 18,
                            right: 18,
                            zIndex: 10,
                            width: "42px",
                            height: "42px",
                            borderRadius: "50%",
                            background: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow:
                              "0 2px 10px rgba(0,0,0,0.15)",
                            cursor: "pointer",
                          }}
                        >
                          <HeartFilled
                            style={{
                              color: "#ff4d4f",
                              fontSize: "22px",
                            }}
                          />
                        </div>
                      </Popconfirm>

                      <img
                        src={`http://localhost:5000/uploads/${item.image}`}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "240px",
                          objectFit: "cover",
                          borderRadius: "18px",
                        }}
                      />
                    </div>
                  }
                >
                     <Tag color="purple" style={{
                            fontSize: "19px",
                            marginBottom:"15px"
                          }}>
                          {item.brand}
                        </Tag>
                  <Meta
                    title={
                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <Text
                          strong
                          style={{
                            fontSize: "16px",
                          }}
                        >
                          {item.name}
                        </Text>

                       
                      </div>
                    }
                  />

                  {/* PRICE */}
                  <Title
                    level={4}
                    style={{
                      color: "#16a34a",
                      marginTop: "14px",
                      marginBottom: "8px",
                    }}
                  >
                    ₹ {item.price}
                  </Title>

                  {/* DESCRIPTION */}
                  <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{
                      color: "#666",
                      minHeight: "44px",
                    }}
                  >
                    {item.description}
                  </Paragraph>

                  {/* BUTTONS */}
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "18px",
                    }}
                  >
                    <Button
                      type="primary"
                      icon={
                        <ShoppingCartOutlined />
                      }
                      block
                      size="large"
                      style={{
                        height: "46px",
                        borderRadius: "12px",
                        fontWeight: 600,
                      }}
                      onClick={() =>
                        handleMoveToCart(item)
                      }
                    >
                      Add To Cart
                    </Button>

                    <Popconfirm
                      title="Delete Item"
                      description="Remove this product?"
                      okText="Delete"
                      cancelText="Cancel"
                      onConfirm={() =>
                        removeWishlistItem(item.id)
                      }
                    >
                      <Button
                        danger
                        size="large"
                        icon={<DeleteOutlined />}
                        style={{
                          width: "50px",
                          height: "46px",
                          borderRadius: "12px",
                        }}
                      />
                    </Popconfirm>
                  </div>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
