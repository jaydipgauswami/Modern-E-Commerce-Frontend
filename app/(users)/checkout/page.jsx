"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

import {
    Card,
    Row,
    Col,
    Typography,
    Steps,
    Form,
    Input,
    Button,
    Radio,
    Divider,
    message,
    List,
    Empty,
} from "antd";

import {
    EnvironmentOutlined,
    TruckOutlined,
    CreditCardOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function CheckoutPage() {
    const router = useRouter();

    const { cartItems, setCartItems } = useCart();

    const [currentStep, setCurrentStep] = useState(0);

    const [shippingData, setShippingData] = useState({});

    const [deliveryMethod, setDeliveryMethod] =
        useState("standard");

    const [paymentMethod, setPaymentMethod] =
        useState("cod");

    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();

    // Cart Validation
    useEffect(() => {
        if (cartItems.length === 0) {
            message.warning("Your cart is empty");

            router.push("/cart");
        }
    }, [cartItems, router]);

    const totalPrice = cartItems.reduce(
        (acc, item) =>
            acc +
            Number(
                item.price
                    .toString()
                    .replace(/[^0-9.-]+/g, "")
            ) *
            item.quantity,
        0
    );

    // Next Step
    const handleNext = async () => {
        if (currentStep === 0) {
            try {
                const values = await form.validateFields();

                setShippingData(values);

                setCurrentStep(1);
            } catch (error) {
                console.log(error);
            }
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    // Previous Step
    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
    };

    // Place Order
    const handlePlaceOrder = () => {
        setLoading(true);

        setTimeout(() => {
            setLoading(false);

            // Fake Payment Gateway
            if (paymentMethod === "online") {
                message.success(
                    "Payment Gateway Opened Successfully"
                );
            }
            // Clear Cart
            setCartItems([]);
            // Success Page
            router.push("/order-success");
        }, 2000);
    };

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
            title: "Summary",
            icon: <CheckCircleOutlined />,
        },
    ];

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f5f5f5",
                padding: "40px 16px",
            }}
        >
            <div
                style={{
                    maxWidth: "1400px",
                    margin: "0 auto",
                }}
            >
                {/* Heading */}
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "40px",
                    }}
                >
                    <Title level={2}>
                        Secure Checkout
                    </Title>

                    <Text type="secondary">
                        Complete your order safely and
                        securely
                    </Text>
                </div>

                {/* Steps */}
                <Card
                    style={{
                        borderRadius: "18px",
                        marginBottom: "24px",
                    }}
                >
                    <Steps
                        current={currentStep}
                        responsive
                        items={steps}
                    />
                </Card>

                <Row gutter={[24, 24]}>
                    {/* LEFT SIDE */}
                    <Col xs={24} lg={16}>
                        <Card
                            style={{
                                borderRadius: "18px",
                            }}
                        >
                            {/* STEP 1 */}
                            {currentStep === 0 && (
                                <>
                                    <Title level={3}>
                                        Shipping Address
                                    </Title>

                                    <Form
                                        layout="vertical"
                                        form={form}
                                    >
                                        <Row gutter={[16, 16]}>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    label="Full Name"
                                                    name="name"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Please enter your name",
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        size="large"
                                                        placeholder="Enter full name"
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    label="Mobile Number"
                                                    name="mobile"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Please enter mobile number",
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        size="large"
                                                        placeholder="Enter mobile"
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24}>
                                                <Form.Item
                                                    label="Address"
                                                    name="address"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Please enter address",
                                                        },
                                                    ]}
                                                >
                                                    <TextArea
                                                        rows={4}
                                                        placeholder="Enter address"
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    label="City"
                                                    name="city"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Please enter city",
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        size="large"
                                                        placeholder="Enter city"
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    label="Pincode"
                                                    name="pincode"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Please enter pincode",
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        size="large"
                                                        placeholder="Enter pincode"
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Form>
                                </>
                            )}

                            {/* STEP 2 */}
                            {currentStep === 1 && (
                                <>
                                    <Title level={3}>
                                        Delivery Method
                                    </Title>

                                    <Radio.Group
                                        value={deliveryMethod}
                                        onChange={(e) =>
                                            setDeliveryMethod(
                                                e.target.value
                                            )
                                        }
                                        style={{
                                            width: "100%",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "16px",
                                            }}
                                        >
                                            <Card
                                                hoverable
                                                onClick={() =>
                                                    setDeliveryMethod(
                                                        "standard"
                                                    )
                                                }
                                                style={{
                                                    border:
                                                        deliveryMethod ===
                                                            "standard"
                                                            ? "2px solid #1677ff"
                                                            : "1px solid #eee",
                                                    cursor: "pointer",
                                                    borderRadius: "14px",
                                                }}
                                            >
                                                <Radio value="standard">
                                                    Standard Delivery
                                                </Radio>

                                                <p
                                                    style={{
                                                        marginTop: "8px",
                                                    }}
                                                >
                                                    Delivery within 4-6
                                                    days
                                                </p>
                                            </Card>

                                            <Card
                                                hoverable
                                                onClick={() =>
                                                    setDeliveryMethod(
                                                        "express"
                                                    )
                                                }
                                                style={{
                                                    border:
                                                        deliveryMethod ===
                                                            "express"
                                                            ? "2px solid #1677ff"
                                                            : "1px solid #eee",
                                                    cursor: "pointer",
                                                    borderRadius: "14px",
                                                }}
                                            >
                                                <Radio value="express">
                                                    Express Delivery
                                                </Radio>

                                                <p
                                                    style={{
                                                        marginTop: "8px",
                                                    }}
                                                >
                                                    Delivery within 1-2
                                                    days
                                                </p>
                                            </Card>
                                        </div>
                                    </Radio.Group>
                                </>
                            )}

                            {/* STEP 3 */}
                            {currentStep === 2 && (
                                <>
                                    <Title level={3}>
                                                Payment Method
                                    </Title>

                                    <Radio.Group
                                        value={paymentMethod}
                                        onChange={(e) =>
                                            setPaymentMethod(
                                                e.target.value
                                            )
                                        }
                                        style={{
                                            width: "100%",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "16px",
                                            }}
                                        >
                                            <Card
                                                hoverable
                                                onClick={() =>
                                                    setPaymentMethod(
                                                        "cod"
                                                    )
                                                }
                                                style={{
                                                    border:
                                                        paymentMethod ===
                                                            "cod"
                                                            ? "2px solid #1677ff"
                                                            : "1px solid #eee",
                                                    cursor: "pointer",
                                                    borderRadius: "14px",
                                                }}
                                            >
                                                <Radio value="cod">
                                                    Cash on Delivery
                                                </Radio>
                                            </Card>

                                            <Card
                                                hoverable
                                                onClick={() =>
                                                    setPaymentMethod(
                                                        "online"
                                                    )
                                                }
                                                style={{
                                                    border:
                                                        paymentMethod ===
                                                            "online"
                                                            ? "2px solid #1677ff"
                                                            : "1px solid #eee",
                                                    cursor: "pointer",
                                                    borderRadius: "14px",
                                                }}
                                            >
                                                <Radio value="online">
                                                    Online Payment
                                                </Radio>
                                            </Card>
                                        </div>
                                    </Radio.Group>
                                </>
                            )}

                            {/* STEP 4 */}
                            {currentStep === 3 && (
                                <>
                                    <Title level={3}>
                                        Order Summary
                                    </Title>

                                  <List
  itemLayout="horizontal"
  dataSource={cartItems}
  renderItem={(item) => {
    const itemPrice = Number(
      item.price
        .toString()
        .replace(/[^0-9.-]+/g, "")
    );

    return (
      <List.Item>
        <List.Item.Meta
          avatar={
            <img
              src={`http://localhost:5000/uploads/${item.image}`}
              alt={item.name}
              style={{
                width: "70px",
                height: "70px",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />
          }
          title={item.name}
          description={`Qty: ${item.quantity}`}
        />

        <Text strong>
          ₹{itemPrice * item.quantity}
        </Text>
      </List.Item>
    );
  }}
/>

                                    <Divider />

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent:
                                                "space-between",
                                            marginBottom: "12px",
                                        }}
                                    >
                                        <Text>
                                            Delivery Charge
                                        </Text>

                                        <Text>
                                            {deliveryMethod ===
                                                "express"
                                                ? "₹100"
                                                : "FREE"}
                                        </Text>
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent:
                                                "space-between",
                                        }}
                                    >
                                        <Title level={4}>
                                            Total
                                        </Title>

                                        <Title level={4}>
                                            ₹
                                            {deliveryMethod ===
                                                "express"
                                                ? totalPrice + 100
                                                : totalPrice}
                                        </Title>
                                    </div>
                                </>
                            )}

                            {/* BUTTONS */}
                            <div
                                style={{
                                    marginTop: "40px",
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                }}
                            >
                                {currentStep > 0 && (
                                    <Button
                                        size="large"
                                        onClick={handlePrev}
                                    >
                                        Previous
                                    </Button>
                                )}

                                {currentStep < 3 ? (
                                    <Button
                                        type="primary"
                                        size="large"
                                        onClick={handleNext}
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

                    {/* RIGHT SIDE */}
                    <Col xs={24} lg={8}>
                        <Card
                            style={{
                                borderRadius: "18px",
                                position: "sticky",
                                top: "80px",
                            }}
                        >
                            <Title level={3}>
                                Cart Summary
                            </Title>

                            <Divider />

                            {cartItems.length === 0 ? (
                                <Empty />
                            ) : (
                                <>
                                    {cartItems.map((item) => {
                                        const itemPrice =
                                            Number(
                                                item.price
                                                    .toString()
                                                    .replace(
                                                        /[^0-9.-]+/g,
                                                        ""
                                                    )
                                            );

                                        return (
                                            <div
                                                key={item.id}
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    marginBottom:
                                                        "16px",
                                                }}
                                            >
                                                <Text>
                                                    {item.name} ×{" "}
                                                    {item.quantity}
                                                </Text>

                                                <Text strong>
                                                    ₹
                                                    {itemPrice *
                                                        item.quantity}
                                                </Text>
                                            </div>
                                        );
                                    })}

                                    <Divider />

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent:
                                                "space-between",
                                        }}
                                    >
                                        <Title level={4}>
                                            Total
                                        </Title>

                                        <Title level={4}>
                                            ₹{totalPrice}
                                        </Title>
                                    </div>
                                </>
                            )}
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}