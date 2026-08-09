"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ProtectedRoute from "../../../component/ProtectedRoute";
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
  Spin,
} from "antd";

import {
  DeleteOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {useCart} from "../../context/CartContext"

import { motion } from "framer-motion";

const { Title, Paragraph } = Typography;
const { Meta } = Card;

export default function WishlistPage() {
const {
  wishlistItems,
  getWishlist,
  removeFromWishlist,
  addToCart,
} = useCart();

  const [loading, setLoading] = useState(true);

  // GET WISHLIST
  const fetchWishlist = async () => {
  try {
    setLoading(true);
    await getWishlist();
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchWishlist();
  }, []);

  // REMOVE WISHLIST ITEM
 const removeWishlistItem = async (id) => {
  try {
    await removeFromWishlist(id);
  } catch (error) {
    console.error(error);
  }
};

  // MOVE TO CART
 const handleMoveToCart = async (product) => {
  try {
    await addToCart(product, 1);

    await removeFromWishlist(product.id);

   
  } catch (error) {
    console.error(error);

  }
};

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
    <ProtectedRoute>
        <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to right, #f8fafc, #eef2ff)",
        padding: "24px",
      }}
    >
      <Title level={2}>My Wishlist</Title>

      {wishlistItems.length === 0 ? (
        <Empty description="Wishlist Empty" />
      ) : (
        <Row gutter={[24, 24]}>
          {wishlistItems?.map((item) => (
            <Col
              xs={24}
              sm={12}
              md={8}
              lg={6}
               key={item.wishlist_id}
            >
              <motion.div whileHover={{ y: -5 }}>
                <Card
                  hoverable
                  cover={
                    <img
                      src={`http://localhost:5000/uploads/${item.image}`}
                      alt={item.name}
                      style={{
                        height: 240,
                        objectFit: "cover",
                      }}
                    />
                  }
                >
                  <Tag color="purple">
                    {item.brand}
                  </Tag>

                  <Meta title={item.name} />

                  <Title
                    level={4}
                    style={{
                      color: "green",
                      marginTop: 10,
                    }}
                  >
                    ₹{item.price}
                  </Title>

                  <Paragraph ellipsis={{ rows: 2 }}>
                    {item.description}
                  </Paragraph>

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                    }}
                  >
                    <Button
                      type="primary"
                      block
                      icon={<ShoppingCartOutlined />}
                      onClick={() =>
                        handleMoveToCart(item)
                      }
                    >
                      Add To Cart
                    </Button>

                    <Popconfirm
                      title="Delete Item"
                      description="Remove from wishlist?"
                      onConfirm={() =>
                        removeWishlistItem(
                          item.id
                        )
                      }
                    >
                      <Button
                        danger
                        icon={<DeleteOutlined />}
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
    </ProtectedRoute>
  
  );
}