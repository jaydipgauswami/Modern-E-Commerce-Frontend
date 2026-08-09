"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import {
  Result,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Divider,
  Tag,
} from "antd";

import {
  CheckCircleFilled,
  ShoppingOutlined,
  ProfileOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = searchParams.get("id");

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#f8fafc,#eef2ff)",
        padding: "40px 16px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <Row justify="center">
          <Col xs={24} lg={18}>
            <Card
              style={{
                borderRadius: 24,
                overflow: "hidden",
                boxShadow:
                  "0 10px 40px rgba(0,0,0,0.08)",
              }}
            >
              {/* Success Section */}

              <Result
                icon={
                  <CheckCircleFilled
                    style={{
                      color: "#52c41a",
                    }}
                  />
                }
                status="success"
                title="Order Placed Successfully!"
                subTitle="Thank you for your purchase. Your order has been received and is being processed."
                extra={[
                  <Button
                    key="orders"
                    type="primary"
                    size="large"
                    icon={<ProfileOutlined />}
                    onClick={() =>
                      router.push("/orders")
                    }
                  >
                    View Orders
                  </Button>,

                  <Button
                    key="shop"
                    size="large"
                    icon={<ShoppingOutlined />}
                    onClick={() =>
                      router.push("/products")
                    }
                  >
                    Continue Shopping
                  </Button>,
                ]}
              />

              <Divider />

              {/* Order Information */}

              <Card
                variant={false}
                style={{
                  background: "#fafafa",
                  borderRadius: 16,
                }}
              >
                <Space
                  orientation="vertical"
                  size="middle"
                  style={{
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      flexWrap: "wrap",
                      gap: 10,
                    }}
                  >
                    <Text strong>
                      Order ID
                    </Text>

                    <Tag
                      color="blue"
                      style={{
                        fontSize: 14,
                        padding:
                          "4px 10px",
                      }}
                    >
                      #{orderId || "N/A"}
                    </Tag>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      flexWrap: "wrap",
                      gap: 10,
                    }}
                  >
                    <Text strong>
                      Order Status
                    </Text>

                    <Tag color="green">
                      CONFIRMED
                    </Tag>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      flexWrap: "wrap",
                      gap: 10,
                    }}
                  >
                    <Text strong>
                      Payment Status
                    </Text>

                    <Tag color="success">
                      SUCCESSFUL
                    </Tag>
                  </div>
                </Space>
              </Card>

              <Divider />

              {/* Security Message */}

              <div
                style={{
                  textAlign: "center",
                }}
              >
                <SafetyCertificateOutlined
                  style={{
                    fontSize: 28,
                    color: "#52c41a",
                  }}
                />

                <Title
                  level={4}
                  style={{
                    marginTop: 12,
                  }}
                >
                  Secure Transaction Completed
                </Title>

                <Text type="secondary">
                  Your payment and order
                  information have been
                  securely processed.
                </Text>
              </div>

              <Divider />

              {/* Bottom Actions */}

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Button
                    block
                    size="large"
                    icon={<ProfileOutlined />}
                    onClick={() =>
                      router.push("/orders")
                    }
                  >
                    View My Orders
                  </Button>
                </Col>

                <Col xs={24} md={12}>
                  <Button
                    block
                    type="primary"
                    size="large"
                    icon={<ShoppingOutlined />}
                    onClick={() =>
                      router.push("/products")
                    }
                  >
                    Continue Shopping
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}