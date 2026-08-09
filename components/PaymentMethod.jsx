"use client";

import {
  Card,
  Radio,
  Space,
  Typography,
  Alert,
} from "antd";

import {
  WalletOutlined,
  CreditCardOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function PaymentMethod({
  paymentMethod,
  setPaymentMethod,
}) {
  return (
    <>
      <Title level={3}>
        Payment Method
      </Title>

      <Alert
        style={{ marginBottom: 24 }}
        title="100% Secure Checkout"
        description="All transactions are encrypted and secured."
        type="success"
        showIcon
        icon={<SafetyCertificateOutlined />}
      />

      <Radio.Group
        value={paymentMethod}
        onChange={(e) =>
          setPaymentMethod(e.target.value)
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
          {/* COD */}

          <Card
            hoverable
            onClick={() =>
              setPaymentMethod("COD")
            }
            style={{
              cursor: "pointer",
              borderRadius: "16px",
              border:
                paymentMethod === "COD"
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
                <Radio value="COD">
                  <Space>
                    <WalletOutlined />

                    <Text strong>
                      Cash On Delivery
                    </Text>
                  </Space>
                </Radio>

                <div
                  style={{
                    marginTop: 10,
                  }}
                >
                  <Text type="secondary">
                    Pay when your order is
                    delivered.
                  </Text>
                </div>
              </div>
            </div>
          </Card>

          {/* Razorpay */}

          <Card
            hoverable
            onClick={() =>
              setPaymentMethod("ONLINE")
            }
            style={{
              cursor: "pointer",
              borderRadius: "16px",
              border:
                paymentMethod ===
                "ONLINE"
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
                <Radio value="ONLINE">
                  <Space>
                    <CreditCardOutlined />

                    <Text strong>
                      Online Payment
                    </Text>
                  </Space>
                </Radio>

                <div
                  style={{
                    marginTop: 10,
                  }}
                >
                  <Text type="secondary">
                    Razorpay Secure Payment
                  </Text>
                </div>
              </div>

              <Space wrap>
                <img
                  src="https://razorpay.com/assets/razorpay-logo.svg"
                  alt="razorpay"
                  style={{
                    height: 22,
                  }}
                />
              </Space>
            </div>
          </Card>
        </Space>
      </Radio.Group>
    </>
  );
}