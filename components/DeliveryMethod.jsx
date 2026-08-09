"use client";

import {
  Card,
  Radio,
  Space,
  Typography,
  Tag,
} from "antd";

import {
  TruckOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

export default function DeliveryMethod({
  deliveryMethod,
  setDeliveryMethod,
}) {
  return (
    <>
      <Title level={3}>
        Delivery Method
      </Title>

      <Radio.Group
        value={deliveryMethod}
        onChange={(e) =>
          setDeliveryMethod(e.target.value)
        }
        style={{
          width: "100%",
        }}
      >
        <Space
          orientation="vertical"
          size={20}
          style={{
            width: "100%",
          }}
        >
          {/* Standard */}

          <Card
            hoverable
            onClick={() =>
              setDeliveryMethod("standard")
            }
            style={{
              cursor: "pointer",
              borderRadius: "16px",
              border:
                deliveryMethod ===
                "standard"
                  ? "2px solid #1677ff"
                  : "1px solid #f0f0f0",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div>
                <Radio value="standard">
                  <Space>
                    <TruckOutlined />

                    <Text strong>
                      Standard Delivery
                    </Text>
                  </Space>
                </Radio>

                <div
                  style={{
                    marginTop: 10,
                  }}
                >
                  <Text type="secondary">
                    Estimated delivery in
                    4 - 6 business days
                  </Text>
                </div>
              </div>

              <Tag>
                FREE
              </Tag>
            </div>
          </Card>

          {/* Express */}

          <Card
            hoverable
            onClick={() =>
              setDeliveryMethod("express")
            }
            style={{
              cursor: "pointer",
              borderRadius: "16px",
              border:
                deliveryMethod ===
                "express"
                  ? "2px solid #1677ff"
                  : "1px solid #f0f0f0",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div>
                <Radio value="express">
                  <Space>
                    <ThunderboltOutlined />

                    <Text strong>
                      Express Delivery
                    </Text>
                  </Space>
                </Radio>

                <div
                  style={{
                    marginTop: 10,
                  }}
                >
                  <Text type="secondary">
                    Delivery in 1 - 2 days
                  </Text>
                </div>
              </div>

              <Tag>
                ₹100
              </Tag>
            </div>
          </Card>
        </Space>
      </Radio.Group>
    </>
  );
}