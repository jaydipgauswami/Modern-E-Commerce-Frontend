"use client";

import { useCart } from "@/app/context/CartContext";
import {
  Card,
  Row,
  Col,
  Button,
  InputNumber,
  Typography,
  Empty,
  Divider,
} from "antd";

import {
  DeleteOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
const { Title, Text, Paragraph } = Typography;

function CartPage() {
const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const totalPrice = cartItems.reduce(
    (acc, item) =>
      acc +
      Number(item.price.toString().replace(/[^0-9.-]+/g, "")) *
        item.quantity,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-24">
      {/* Heading */}
      <div className="text-center mb-12">
        <Title level={2}>
          <ShoppingCartOutlined /> Your Cart
        </Title>

        <Text type="secondary">
          Manage your products and checkout easily
        </Text>
      </div>

      {cartItems.length === 0 ? (
        <Card className="rounded-2xl shadow-sm">
          <Empty description="Your cart is empty" />
        </Card>
      ) : (
        <Row gutter={[24, 24]} align="top">
          {/* LEFT SIDE */}
          <Col xs={24} xl={16}>
            <div className="space-y-5">
              {cartItems.map((item) => {
                const itemPrice = Number(
                  item.price.toString().replace(/[^0-9.-]+/g, "")
                );

                return (
                  <Card
                    key={item.id}
                    className="rounded-2xl shadow-sm"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* IMAGE */}
                      <div className="w-full lg:w-44 flex justify-center">
                        <img
                          src={`http://localhost:5000/uploads/${item.image}`}
                          alt={item.name}
                          className="w-40 h-40 object-cover rounded-xl"
                        />
                      </div>

                      {/* CONTENT */}
                      <div className="flex-1 flex flex-col lg:flex-row justify-between gap-6">
                        {/* PRODUCT INFO */}
                        <div className="flex-1">
                          <Title level={4} className="mb-1">
                            {item.name}
                          </Title>

                          <Text type="secondary">
                            Brand: {item.brand}
                          </Text>

                          <Paragraph
                            ellipsis={{ rows: 2 }}
                            className="mt-3"
                          >
                            {item.description}
                          </Paragraph>

                          <Title level={5} className="mt-3">
                            ₹{itemPrice}
                          </Title>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex flex-col justify-between lg:items-end">
                          {/* QUANTITY */}
                          <div>
                            <Text strong>Quantity</Text>

                            <div className="mt-2">
                              <InputNumber
                                min={1}
                                value={item.quantity}
                                size="large"
                                onChange={(value) =>
                                  updateQuantity(item.id, value)
                                }
                              />
                            </div>
                          </div>

                          {/* TOTAL + REMOVE */}
                          <div className="mt-6 lg:text-right">
                            <Title level={5}>
                              Total: ₹
                              {itemPrice * item.quantity}
                            </Title>

                            <Button
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() =>
                                removeFromCart(item.id)
                              }
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Col>

          {/* RIGHT SIDE */}
          <Col xs={24} xl={8}>
            <Card className="rounded-2xl shadow-sm xl:sticky xl:top-0">
              <Title level={3}>Order Summary</Title>

              <Divider />

              <div className="flex justify-between mb-5">
                <Text>Total Items</Text>

                <Text strong>{cartItems.length}</Text>
              </div>

              <div className="flex justify-between items-center mb-8">
                <Text strong>Total Price</Text>

                <Title level={3} className="m-0">
                  ₹{totalPrice}
                </Title>
              </div>

              <Button
                type="primary"
                size="large"
                block
                className="h-12 rounded-xl"
                onClick={ router.push("/checkout")}
              >
                Proceed to Checkout
              </Button>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default CartPage;