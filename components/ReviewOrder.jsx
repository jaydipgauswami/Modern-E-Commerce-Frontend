"use client";

import {
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Avatar,
  Tag,
  Space,
} from "antd";

import {
  EnvironmentOutlined,
  CreditCardOutlined,
  TruckOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function ReviewOrder({
  shippingData,
  cartItems,
  summary,
  deliveryMethod,
  paymentMethod,
}) {
  const shippingCharge =
    deliveryMethod === "express" ? 100 : 0;

  const grandTotal =
    Number(summary?.subtotal || 0) +
    shippingCharge;

  return (
    <>
      <Title level={3}>
        Review Your Order
      </Title>

      <Row gutter={[24, 24]}>
        {/* Customer Information */}

        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                <UserOutlined />
                Customer Details
              </Space>
            }
            style={{
              borderRadius: 16,
            }}
          >
            <p>
              <Text strong>Name:</Text>{" "}
              {shippingData?.full_name}
            </p>

            <p>
              <Text strong>Email:</Text>{" "}
              {shippingData?.email}
            </p>

            <p>
              <Text strong>Phone:</Text>{" "}
              {shippingData?.phone}
            </p>
          </Card>
        </Col>

        {/* Address */}

        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                <EnvironmentOutlined />
                Shipping Address
              </Space>
            }
            style={{
              borderRadius: 16,
            }}
          >
            <p>
              {shippingData?.address}
            </p>

            <p>
              {shippingData?.city},{" "}
              {shippingData?.state}
            </p>

            <p>
              {shippingData?.pincode}
            </p>
          </Card>
        </Col>

        {/* Delivery */}

        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                <TruckOutlined />
                Delivery Method
              </Space>
            }
            style={{
              borderRadius: 16,
            }}
          >
            <Tag color="blue">
              {deliveryMethod ===
              "express"
                ? "Express Delivery"
                : "Standard Delivery"}
            </Tag>

            <p
              style={{
                marginTop: 10,
              }}
            >
              {deliveryMethod ===
              "express"
                ? "1 - 2 Business Days"
                : "4 - 6 Business Days"}
            </p>
          </Card>
        </Col>

        {/* Payment */}

        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                <CreditCardOutlined />
                Payment Method
              </Space>
            }
            style={{
              borderRadius: 16,
            }}
          >
            <Tag color="green">
              {paymentMethod ===
              "ONLINE"
                ? "Online Payment"
                : "Cash On Delivery"}
            </Tag>
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Ordered Products */}

      <Card
        title="Ordered Products"
        style={{
          borderRadius: 16,
        }}
      >
      <div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: 16,
  }}
>
  {cartItems.map((item) => (
    <Card
      key={item.id}
      size="small"
      style={{
        borderRadius: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
          }}
        >
          <Avatar
            size={70}
            shape="square"
            src={`http://localhost:5000/uploads/${item.image}`}
          />

          <div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              {item.name}
            </div>

            <div>
              Brand: {item.brand}
            </div>

            <Tag color="blue">
              Qty: {item.quantity}
            </Tag>
          </div>
        </div>

        <Title
          level={5}
          style={{
            margin: 0,
          }}
        >
          ₹
          {Number(item.price) *
            Number(item.quantity)}
        </Title>
      </div>
    </Card>
  ))}
</div>
      </Card>

      <Divider />

      {/* Total Summary */}

      <Card
        style={{
          borderRadius: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            marginBottom: 12,
          }}
        >
          <Text>Subtotal</Text>

          <Text strong>
            ₹
            {summary?.subtotal || 0}
          </Text>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            marginBottom: 12,
          }}
        >
          <Text>Shipping</Text>

          <Text strong>
            {shippingCharge === 0
              ? "FREE"
              : `₹${shippingCharge}`}
          </Text>
        </div>

        <Divider />

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
          }}
        >
          <Title level={4}>
            Grand Total
          </Title>

          <Title level={4}>
            ₹{grandTotal}
          </Title>
        </div>
      </Card>
    </>
  );
}