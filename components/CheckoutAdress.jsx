"use client";

import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Row,
  Col,
  Card,
  Skeleton,
  Typography,
} from "antd";

const { Title } = Typography;
const { TextArea } = Input;

export default function CheckoutAddress({
  form,
  onProfileLoaded,
}) {
    console.log("CheckoutAddress form:", form);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);
  

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/users/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        const user = data.user;

        const values = {
          full_name:
            `${user.first_name || ""} ${
              user.last_name || ""
            }`.trim(),
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          city: user.city || "",
          state: user.state || "",
          pincode: user.pincode || "",
        };

        form.setFieldsValue(values);

        onProfileLoaded?.(values);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 10 }} />
      </Card>
    );
  }

  return (
    <>
      <Title level={3}>
        Shipping Address
      </Title>

      
    
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Form.Item
            label="Full Name"
            name="full_name"
            rules={[
              {
                required: true,
                message: "Full name is required",
              },
            ]}
          >
            <Input />
          </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message:
                    "Email is required",
                },
                {
                  type: "email",
                  message:
                    "Enter valid email",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter email"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[
                {
                  required: true,
                  message:
                    "Phone number is required",
                },
                {
                  pattern:
                    /^[6-9]\d{9}$/,
                  message:
                    "Enter valid mobile number",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter mobile number"
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
                    "Address is required",
                },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Enter address"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label="City"
              name="city"
              rules={[
                {
                  required: true,
                  message:
                    "City is required",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="City"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label="State"
              name="state"
              rules={[
                {
                  required: true,
                  message:
                    "State is required",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="State"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label="Pincode"
              name="pincode"
              rules={[
                {
                  required: true,
                  message:
                    "Pincode is required",
                },
                {
                  pattern:
                    /^[1-9][0-9]{5}$/,
                  message:
                    "Enter valid pincode",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Pincode"
              />
            </Form.Item>
          </Col>
        </Row>
      
    </>
  );
}