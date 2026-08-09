"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

import {
  Card,
  Row,
  Col,
  Steps,
  Typography,
  Button,
  Form,
  message,
} from "antd";

import {
  EnvironmentOutlined,
  TruckOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

import CheckoutAddress from "../../../components/CheckoutAdress";
import DeliveryMethod from "../../../components/DeliveryMethod";
import PaymentMethod from "../../../components/PaymentMethod";
import ReviewOrder from "../../../components/ReviewOrder";
import OrderSummary from "../../../components/OrderSummry";
import Script from "next/script";


const { Title, Text } = Typography;

export default function CheckoutPage() {
  const router = useRouter();

  const { cartItems, summary, clearCart } =
    useCart();

  const [form] = Form.useForm();

  const [currentStep, setCurrentStep] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [shippingData, setShippingData] =
    useState({});

  const [deliveryMethod, setDeliveryMethod] =
    useState("standard");

  const [paymentMethod, setPaymentMethod] =
    useState("COD");
      const steps = [
    {
      title: "Address",
      icon: <EnvironmentOutlined />,
    },
    {
      title: "Delivery",
      icon: <TruckOutlined />,
    },
    {
      title: "Payment",
      icon: <CreditCardOutlined />,
    },
    {
      title: "Review",
      icon: <CheckCircleOutlined />,
    },
  ];

    const handleNext = async () => {
    try {
      if (currentStep === 0) {
        const values =
          await form.validateFields();

        setShippingData(values);
      }

      setCurrentStep((prev) => prev + 1);
    } catch (error) {}
  };

    const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

    const createOrder = async (
    paymentStatus = "PENDING",
    razorpayData = {}
  ) => {
    const token =
      localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:5000/api/orders",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...shippingData,

          payment_method:
            paymentMethod,

          payment_status:
            paymentStatus,

          razorpay_order_id:
            razorpayData
              ?.razorpay_order_id,

          razorpay_payment_id:
            razorpayData
              ?.razorpay_payment_id,
        }),
      }
    );

    return await res.json();
  };
    const handleCOD = async () => {
    try {
      setLoading(true);

      const data =
        await createOrder();

      if (data.success) {
        clearCart();

        router.push(
          `/order-success?id=${data.order.id}`
        );
      }
    } catch (error) {
      message.error(
        "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  };
    const handleOnlinePayment =
    async () => {
      try {
        setLoading(true);

        const token =
          localStorage.getItem(
            "token"
          );

        const paymentRes =
          await fetch(
            "http://localhost:5000/api/payment/create-order",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const paymentData =
          await paymentRes.json();

        const options = {
          key:
            process.env
              .NEXT_PUBLIC_RAZORPAY_KEY_ID,

          amount:
            paymentData.amount,

          currency:
            paymentData.currency,

          order_id:
            paymentData.orderId,

          name: "My Store",

          description:
            "Order Payment",

          handler:
            async function (
              response
            ) {
              const verifyRes =
                await fetch(
                  "http://localhost:5000/api/payment/verify",
                  {
                    method:
                      "POST",

                    headers: {
                      "Content-Type":
                        "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body:
                      JSON.stringify(
                        response
                      ),
                  }
                );

              const verifyData =
                await verifyRes.json();

              if (
                verifyData.success
              ) {
                const orderData =
                  await createOrder(
                    "PAID",
                    response
                  );

                clearCart();

                router.push(
                  `/order-success?id=${orderData.order.id}`
                );
              }
            },
        };

        const razorpay =
          new window.Razorpay(
            options
          );

        razorpay.open();
      } catch (error) { 
        message.error(
          "Payment Failed"
        );
      } finally {
        setLoading(false);
      }
    };
      const handlePlaceOrder =
    async () => {
      if (
        paymentMethod ===
        "ONLINE"
      ) {
        await handleOnlinePayment();
      } else {
        await handleCOD();
      }
    };
      return (

        <>
  <Script
    src="https://checkout.razorpay.com/v1/checkout.js"
    strategy="afterInteractive"
  />

  {/* your checkout page UI */}

    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#f8fafc,#eef2ff)",
        padding: "30px 16px",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: 30,
          }}
        >
          <Title>
            Secure Checkout
          </Title>

          <Text type="secondary">
            Complete your order
            securely
          </Text>
        </div>

        <Card
          style={{
            borderRadius: 20,
            marginBottom: 24,
          }}
        >
          <Steps
            current={currentStep}
            items={steps}
          />
        </Card>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card
              style={{
                borderRadius: 20,
              }}
            >
          <Form
  form={form}
  layout="vertical"
>
  {currentStep === 0 && (
    <CheckoutAddress
      form={form}
      onProfileLoaded={(values) =>
        setShippingData(values)
      }
    />
  )}
</Form>

              {currentStep === 1 && (
                <DeliveryMethod
                  deliveryMethod={
                    deliveryMethod
                  }
                  setDeliveryMethod={
                    setDeliveryMethod
                  }
                />
              )}

              {currentStep === 2 && (
                <PaymentMethod
                  paymentMethod={
                    paymentMethod
                  }
                  setPaymentMethod={
                    setPaymentMethod
                  }
                />
              )}

              {currentStep === 3 && (
                <ReviewOrder
                  shippingData={
                    shippingData
                  }
                  cartItems={
                    cartItems
                  }
                  summary={summary}
                  deliveryMethod={
                    deliveryMethod
                  }
                  paymentMethod={
                    paymentMethod
                  }
                />
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  marginTop: 40,
                }}
              >
                {currentStep > 0 && (
                  <Button
                    size="large"
                    onClick={
                      handlePrev
                    }
                  >
                    Previous
                  </Button>
                )}

                {currentStep < 3 ? (
                  <Button
                    type="primary"
                    size="large"
                    onClick={
                      handleNext
                    }
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    size="large"
                    loading={loading}
                    onClick={
                      handlePlaceOrder
                    }
                  >
                    Place Order
                  </Button>
                )}
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <OrderSummary
              cartItems={cartItems}
              summary={summary}
              deliveryMethod={
                deliveryMethod
              }
            />
          </Col>
        </Row>
      </div>
    </div>
    </>
  );
}