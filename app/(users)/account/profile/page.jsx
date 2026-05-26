"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Card,
  Row,
  Col,
  Avatar,
  Typography,
  Button,
  Space,
  Spin,
} from "antd";

import {
  UserOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  CalendarOutlined,
  NumberOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // Fetch Profile
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/users/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch profile");
      }

      setUser(data.user);
    } catch (error) {
      console.log("Profile Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Loading
  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f5f5",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  const profileData = [
    {
      title: "First Name",
      value: user?.first_name || "N/A",
      icon: <UserOutlined />,
    },
    {
      title: "Last Name",
      value: user?.last_name || "N/A",
      icon: <UserOutlined />,
    },
    {
      title: "Email",
      value: user?.email || "N/A",
      icon: <MailOutlined />,
    },
    {
      title: "Date of Birth",
      value: user?.dob || "N/A",
      icon: <CalendarOutlined />,
    },
    {
      title: "Phone",
      value: user?.phone || "N/A",
      icon: <PhoneOutlined />,
    },
    {
      title: "Pincode",
      value: user?.pincode || "N/A",
      icon: <NumberOutlined />,
    },
    {
      title: "State",
      value: user?.state || "N/A",
      icon: <EnvironmentOutlined />,
    },
    {
      title: "Country",
      value: user?.country || "N/A",
      icon: <GlobalOutlined />,
    },
  ];

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        background: "#f5f5f5",
        padding: "16px",
      }}
    >
      <Card
        variant="borderless"
  style={{
    height: "100%",
    borderRadius: "20px",
    overflow: "hidden",
  }}
  styles={{
    body: {
      padding: 0,
      height: "100%",
      display: "flex",
      flexDirection: "column",
    },
  }}
      >
        {/* Header */}
        <div
          style={{
            background: "#1677ff",
            padding: "10px 30px",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <Space size={20}>
            <Avatar
              size={50}
              src={user?.image}
              icon={<UserOutlined />}
            />

            <div>
              <Title
                level={3}
                style={{
                  color: "#fff",
                  margin: 0,
                }}
              >
                {user?.first_name || user?.name || "User"}
              </Title>

              <Text style={{ color: "#dbeafe" }}>
                {user?.email}
              </Text>
            </div>
          </Space>

          <Link href="/account/profile/editprofile">
            <Button
              type="primary"
              size="large"
              icon={<EditOutlined />}
            >
              Edit Profile
            </Button>
          </Link>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            overflow: "hidden",
          }}
        >
          <Row gutter={[16, 16]}>
            {profileData.map((item, index) => (
              <Col xs={24} md={12} key={index}>
                <Card
                   variant="borderless"
                  style={{
                    borderRadius: "16px",
                    background: "#fafafa",
                    height: "100%",
                  }}
                >
                  <Space align="start">
                    <div
                      style={{
                        fontSize: "20px",
                        marginTop: "5px",
                      }}
                    >
                      {item.icon}
                    </div>

                    <div>
                      <Text type="secondary">
                        {item.title}
                      </Text>

                      <Title
                        level={5}
                        style={{
                          marginTop: "5px",
                          marginBottom: 0,
                        }}
                      >
                        {item.value}
                      </Title>
                    </div>
                  </Space>
                </Card>
              </Col>
            ))}

            {/* Address */}
            <Col span={24}>
              <Card
                variant="borderless"
                style={{
                  borderRadius: "16px",
                  background: "#fafafa",
                }}
              >
                <Text type="secondary">
                  Address
                </Text>

                <Title
                  level={5}
                  style={{
                    marginTop: "8px",
                    marginBottom: 0,
                  }}
                >
                  {user?.address || "N/A"}
                </Title>
              </Card>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
}