"use client";

import {
  Card,
  Divider,
  Typography,
  Empty,
  Avatar,
  Tag,
  Space,
} from "antd";

const { Title, Text } = Typography;

export default function OrderSummary({
  cartItems,
  summary,
  deliveryMethod,
}) {
  const shippingCharge =
    deliveryMethod === "express" ? 100 : 0;

  const finalTotal =
    Number(summary?.subtotal || 0) +
    shippingCharge;

  return (
    <Card
      style={{
        borderRadius: 20,
        position: "sticky",
        top: 90,
      }}
    >
      <Title level={4}>
        Order Summary
      </Title>

      <Divider />

      {!cartItems?.length ? (
        <Empty
          description="No items in cart"
        />
      ) : (
        <>
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
          gap: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 12,
          }}
        >
          <Avatar
            shape="square"
            size={64}
            src={`http://localhost:5000/uploads/${item.image}`}
          />

          <div>
            <div
              style={{
                fontWeight: 600,
              }}
            >
              {item.name}
            </div>

            <div>
              Brand: {item.brand}
            </div>

            <Tag>
              Qty: {item.quantity}
            </Tag>
          </div>
        </div>

        <Typography.Text strong>
          ₹
          {Number(item.price) *
            Number(item.quantity)}
        </Typography.Text>
      </div>
    </Card>
  ))}
</div>

          <Divider />

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
              alignItems: "center",
            }}
          >
            <Title
              level={5}
              style={{
                margin: 0,
              }}
            >
              Grand Total
            </Title>

            <Title
              level={4}
              style={{
                margin: 0,
              }}
            >
              ₹{finalTotal}
            </Title>
          </div>

          <Divider />

          <div
            style={{
              textAlign: "center",
            }}
          >
            <Tag color="green">
              Secure Checkout
            </Tag>

            <Tag color="blue">
              Fast Delivery
            </Tag>
          </div>
        </>
      )}
    </Card>
  );
}