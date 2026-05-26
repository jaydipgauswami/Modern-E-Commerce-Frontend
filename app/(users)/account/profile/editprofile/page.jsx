"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  Form,
  Input,
  Button,
  Row,
  Col,
  Avatar,
  Typography,
  Upload,
  DatePicker,
  message,
  Space,
} from "antd";

import {
  UserOutlined,
  CameraOutlined,
  SaveOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function EditProfile() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const [imagePreview, setImagePreview] = useState("");

  // Image Upload
  const handleImage = (info) => {
    const file = info.file.originFileObj;

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);

    form.setFieldsValue({
      image: previewUrl,
    });
  };

  // Submit
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const payload = {
        first_name: values.first_name || null,
        last_name: values.last_name || null,
        email: values.email || null,
        dob: values.dob
          ? dayjs(values.dob).format("YYYY-MM-DD")
          : null,
        phone: values.phone || null,
        address: values.address || null,
        state: values.state || null,
        country: values.country || null,
        pincode: values.pincode || null,
        image: values.image || null,
      };

      const res = await fetch(
        "http://localhost:5000/api/users/update-profile",
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to update profile"
        );
      }

      message.success(
        "Profile updated successfully"
      );

      router.push("/account/profile");
    } catch (error) {
      console.log("Update Error:", error.message);

      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "24px",
      }}
    >
      <Card
        variant="borderless"
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          borderRadius: "24px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: "32px",
            textAlign: "center",
          }}
        >
          <Title level={2} style={{ marginBottom: 0 }}>
            Edit Profile
          </Title>

          <Text type="secondary">
            Update your personal information
          </Text>
        </div>

        {/* Profile Image */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "40px",
          }}
        >
          <div style={{ position: "relative" }}>
            <Avatar
              size={130}
                src={imagePreview || null}
              icon={<UserOutlined />}
            />

            <Upload
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleImage}
            >
              <Button
                type="primary"
                shape="circle"
                icon={<CameraOutlined />}
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                }}
              />
            </Upload>
          </div>
        </div>

        {/* Form */}
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
        >
          <Row gutter={[20, 20]}>
            {/* First Name */}
            <Col xs={24} md={12}>
              <Form.Item
                label="First Name"
                name="first_name"
                rules={[
                  {
                    required: true,
                    message:
                      "First name is required",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter first name"
                  prefix={<UserOutlined />}
                />
              </Form.Item>
            </Col>

            {/* Last Name */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Last Name"
                name="last_name"
                rules={[
                  {
                    required: true,
                    message:
                      "Last name is required",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter last name"
                  prefix={<UserOutlined />}
                />
              </Form.Item>
            </Col>

            {/* Email */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Email is required",
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
                  prefix={<MailOutlined />}
                />
              </Form.Item>
            </Col>

            {/* DOB */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Date of Birth"
                name="dob"
              >
                <DatePicker
                  size="large"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            {/* Phone */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  {
                    required: true,
                    message:
                      "Phone number is required",
                  },
                  {
                    pattern: /^\d{10}$/,
                    message:
                      "Phone must be 10 digits",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter phone number"
                  prefix={<PhoneOutlined />}
                />
              </Form.Item>
            </Col>

            {/* Pincode */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Pincode"
                name="pincode"
                rules={[
                  {
                    pattern: /^\d{6}$/,
                    message:
                      "Pincode must be 6 digits",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter pincode"
                />
              </Form.Item>
            </Col>

            {/* State */}
            <Col xs={24} md={12}>
              <Form.Item
                label="State"
                name="state"
                rules={[
                  {
                    required: true,
                    message: "State is required",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter state"
                  prefix={
                    <EnvironmentOutlined />
                  }
                />
              </Form.Item>
            </Col>

            {/* Country */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Country"
                name="country"
                rules={[
                  {
                    required: true,
                    message:
                      "Country is required",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter country"
                  prefix={
                    <EnvironmentOutlined />
                  }
                />
              </Form.Item>
            </Col>

            {/* Address */}
            <Col span={24}>
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

            {/* Submit */}
            <Col span={24}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Space>
                  <Button
                    size="large"
                    onClick={() =>
                      router.push(
                        "/account/profile"
                      )
                    }
                  >
                    Cancel
                  </Button>

                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    icon={<SaveOutlined />}
                  >
                    Save Changes
                  </Button>
                </Space>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}