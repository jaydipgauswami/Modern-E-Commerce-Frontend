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

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setUser(data.user);
    } catch (err) {
      console.log("Profile Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" />
      </div>
    );
  }

  const profileData = [
    { title: "First Name", value: user?.first_name, icon: <UserOutlined /> },
    { title: "Last Name", value: user?.last_name, icon: <UserOutlined /> },
    { title: "Email", value: user?.email, icon: <MailOutlined /> },
    { title: "DOB", value: user?.dob, icon: <CalendarOutlined /> },
    { title: "Phone", value: user?.phone, icon: <PhoneOutlined /> },
    { title: "Pincode", value: user?.pincode, icon: <NumberOutlined /> },
    { title: "State", value: user?.state, icon: <EnvironmentOutlined /> },
    { title: "State", value: user?.city, icon: <EnvironmentOutlined /> },
    { title: "Country", value: user?.country, icon: <GlobalOutlined /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        
        {/* CARD */}
        <Card
          className="shadow-lg rounded-2xl"
          styles={{
            body: { padding: 0 },
          }}
        >
          {/* HEADER */}
<div
  style={{
    background:
      "linear-gradient(135deg,#1677ff,#4096ff,#69b1ff)",
    padding: "24px",
    color: "#fff",
  }}
  className="flex flex-col sm:flex-row items-center justify-between gap-4"
>            
            {/* USER INFO */}
            <div className="flex items-center gap-4">
            <Avatar
  size={80}
  src={
    user?.image
      ? `http://localhost:5000/uploads/${user.image}`
      : undefined
  }
  icon={<UserOutlined />}
/>

            <div>
  <h2 className="text-xl sm:text-2xl font-bold">
    {user?.first_name} {user?.last_name}
  </h2>

  <p className="text-blue-100 text-sm break-all">
    {user?.email}
  </p>
</div>
            </div>

            {/* BUTTON */}
            <Link href="/account/profile/editprofile">
              <Button
                type="primary"
                icon={<EditOutlined />}
                className="w-full sm:w-auto"
              >
                Edit Profile
              </Button>
            </Link>
          </div>

          {/* BODY */}
          <div className="p-4 sm:p-6">

            <Row gutter={[16, 16]}>
              {profileData.map((item, i) => (
                <Col xs={24} sm={12} key={i}>
                  <Card className="rounded-xl bg-gray-50">
                    <Space align="start">
                      <div className="text-xl text-blue-600">
                        {item.icon}
                      </div>

                      <div>
                        <Text type="secondary">{item.title}</Text>
                        <div className="font-semibold">
                          {item.value || "N/A"}
                        </div>
                      </div>
                    </Space>
                  </Card>
                </Col>
              ))}

              {/* ADDRESS */}
           <Col span={24}>
  <Card
    style={{
      borderRadius: 16,
      background: "#fafafa",
    }}
  >
    <Space align="start">
      <EnvironmentOutlined
        style={{
          color: "#1677ff",
          fontSize: 20,
        }}
      />

      <div>
        <Text type="secondary">
          Complete Address
        </Text>

        <div
          style={{
            fontWeight: 600,
            marginTop: 8,
          }}
        >
          {user?.address || "N/A"}
        </div>
      </div>
    </Space>
  </Card>
</Col>
            </Row>
          </div>
        </Card>
      </div>
    </div>
  );
}