"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {toast, Toaster} from "sonner"
import ProtectedRoute from "../../../component/ProtectedRoute";
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Select, 
  Tag, 
  Badge, 
  Space, 
  Row, 
  Col, 
  Tooltip, 
  Popconfirm, 
  Modal, 
  Form, 
  Empty, 
  Checkbox, 
  message 
} from "antd";
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  LockOutlined, 
  UnlockOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
  CloseOutlined
} from "@ant-design/icons";

const API_URL = "http://localhost:5000/api/admin/users";

export default function UsersPage() {
  const router = useRouter();

  // Users State
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  
  // Search, Filters & Modals State
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form Instance
  const [formInstance] = Form.useForm();

  // Auth Error Redirect
  const handleAuthError = (res) => {
    if (res.status === 401) {
      localStorage.removeItem("token");
      message.error("Session unauthorized. Redirecting to login...");
      router.push("/login");
      return true;
    }
    return false;
  };

  // Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (handleAuthError(res)) return;
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }
      setUsers(data.users || data || []);
    } catch (err) {
      message.error(err.message || "Failed to fetch users catalog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtered Users (Search, Role, Status)
  const filteredUsers = useMemo(() => {
    return users
      .filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      )
      .filter((u) => {
        if (roleFilter === "all") return true;
        return (u.role || "").trim().toLowerCase() === roleFilter.toLowerCase();
      })
      .filter((u) => {
        if (statusFilter === "all") return true;
        if (statusFilter === "Blocked") {
          return u.is_blocked === true;
        }
        return (u.status || "").toLowerCase() === statusFilter.toLowerCase();
      });
  }, [users, search, roleFilter, statusFilter]);

  // Checkbox Select handler
  const toggleSelect = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAllMobile = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  // Open Modal Forms
  const openAddModal = () => {
    formInstance.resetFields();
    setEditId(null);
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    formInstance.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setEditId(user.id);
    setModalOpen(true);
  };

  // Add User Operation
  const addUser = async (values) => {
    setSubmitLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
      if (handleAuthError(res)) return;
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      toast.success("User created successfully");
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      message.error(err.message || "Failed to create user account");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Update User Operation
  const updateUser = async (values) => {
    setSubmitLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
      if (handleAuthError(res)) return;
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      toast.success("User details updated");
      setModalOpen(false);
      setEditId(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || "Failed to update user");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSubmit = (values) => {
    if (editId) {
      updateUser(values);
    } else {
      addUser(values);
    }
  };

  // Delete User Account
  const deleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (handleAuthError(res)) return;
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Operation failed");
      }

      toast.success("User deleted successfully");
      setSelectedUsers((prev) => prev.filter((key) => key !== id));
      fetchUsers();
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  // Toggle block user
  const handleBlockUser = async (user) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/admin/users/${user.id}/block`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_blocked: !user.is_blocked,
        }),
      });
      if (handleAuthError(res)) return;
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to toggle status");
      }

      toast.success(user.is_blocked ? "User unblocked successfully" : "User blocked successfully");
      fetchUsers();
    } catch (error) {
      toast.error(error.message || "Status change failed");
    }
  };

  // Bulk Delete Selected Accounts
  const deleteSelected = async () => {
    try {
      if (selectedUsers.length === 0) {
        toast.warning("No users selected");
        return;
      }

      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/admin/users/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ids: selectedUsers,
          action: "delete",
        }),
      });
      if (handleAuthError(res)) return;
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Bulk operation failed");
      }

      toast.success(data.message || "Selected users deleted successfully");
      setSelectedUsers([]);
      fetchUsers();
    } catch (err) {
    toast.error(err.message || "Something went wrong processing bulk delete");
    }
  };

  // Clear all filter values
  const handleClearFilters = () => {
    setSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
  };

  // Badge/Tag style wrappers
  const getRoleTag = (role) => {
    const r = (role || "").trim().toLowerCase();
    if (r === "admin") return <Tag color="red" className="rounded-full px-3">Admin</Tag>;
    if (r === "manager") return <Tag color="orange" className="rounded-full px-3">Manager</Tag>;
    return <Tag color="green" className="rounded-full px-3">User</Tag>;
  };

  const getStatusTag = (status, isBlocked) => {
    if (isBlocked) return <Tag color="error" className="rounded-full px-3">Blocked</Tag>;
    const s = (status || "").trim().toLowerCase();
    if (s === "active") return <Tag color="success" className="rounded-full px-3">Active</Tag>;
    if (s === "inactive") return <Tag color="default" className="rounded-full px-3">Inactive</Tag>;
    return <Tag color="error" className="rounded-full px-3">Blocked</Tag>;
  };

  // Desktop Table Column configs
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => (
        <Space>
          <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs select-none">
            {text ? text.charAt(0).toUpperCase() : "?"}
          </div>
          <span className="font-semibold text-gray-800">{text}</span>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => <span className="text-gray-500 text-xs">{email}</span>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (role) => getRoleTag(role),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status, record) => getStatusTag(status, record.is_blocked),
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      width: 140,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit Details">
            <Button
              type="text"
              icon={<EditOutlined className="text-amber-500 hover:scale-110 transition-transform" />}
              onClick={() => openEditModal(record)}
            />
          </Tooltip>

          <Tooltip title={record.is_blocked ? "Unblock Account" : "Block Account"}>
            <Popconfirm
              title={record.is_blocked ? "Unblock User" : "Block User"}
              description={`Are you sure you want to ${record.is_blocked ? "unblock" : "block"} ${record.name}?`}
              onConfirm={() => handleBlockUser(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="text"
                icon={
                  record.is_blocked ? (
                    <UnlockOutlined className="text-green-500 hover:scale-110 transition-transform" />
                  ) : (
                    <LockOutlined className="text-red-500 hover:scale-110 transition-transform" />
                  )
                }
              />
            </Popconfirm>
          </Tooltip>

          <Tooltip title="Delete Account">
            <Popconfirm
              title="Delete Account"
              description={`Delete account "${record.name}" permanently?`}
              onConfirm={() => deleteUser(record.id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined className="hover:scale-110 transition-transform" />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
   <ProtectedRoute>
     <div className="p-4 sm:p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            User Management
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            View, manage, update, and regulate access roles for store user accounts.
          </p>
        </div>
        <Button 
          type="primary" 
          size="large"
          icon={<PlusOutlined />} 
          onClick={openAddModal}
          className="bg-indigo-600 hover:bg-indigo-700 border-none shadow-sm rounded-lg flex items-center h-11 w-full sm:w-auto justify-center"
        >
          Add User
        </Button>
      </div>

      {/* Control Filters Area */}
      <Card className="shadow-sm border-gray-200 rounded-xl mb-6" styles={{ body: { padding: "16px" } }}>
        <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            className="rounded-lg h-10 md:w-1/3 w-full"
          />

          <div className="flex flex-wrap gap-2 items-center">
            <Select 
              value={roleFilter} 
              onChange={setRoleFilter}
              className="h-10 w-32"
            >
              <Select.Option value="all">All Roles</Select.Option>
              <Select.Option value="Admin">Admin</Select.Option>
              <Select.Option value="Manager">Manager</Select.Option>
              <Select.Option value="User">User</Select.Option>
            </Select>

            <Select 
              value={statusFilter} 
              onChange={setStatusFilter}
              className="h-10 w-32"
            >
              <Select.Option value="all">All Status</Select.Option>
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
              <Select.Option value="Blocked">Blocked</Select.Option>
            </Select>

            <Button 
              onClick={handleClearFilters}
              className="h-10 rounded-lg"
            >
              Clear
            </Button>
            
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchUsers}
              loading={loading}
              className="h-10 rounded-lg flex items-center justify-center"
            />
          </div>
        </div>
      </Card>

      {/* Bulk actions banner */}
      {selectedUsers.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-150 rounded-xl p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 animate-pulse">
          <div className="flex items-center gap-2">
            <InfoCircleOutlined className="text-indigo-600 text-base flex-shrink-0" />
            <span className="text-indigo-800 text-xs sm:text-sm font-medium">
              {selectedUsers.length} user account(s) selected
            </span>
          </div>
          <Space className="w-full sm:w-auto justify-end">
            <Popconfirm
              title="Delete Selected Accounts"
              description={`Delete all ${selectedUsers.length} selected accounts permanently?`}
              onConfirm={deleteSelected}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button type="primary" danger size="small" icon={<DeleteOutlined />}>
                Delete Selected
              </Button>
            </Popconfirm>
            <Button size="small" onClick={() => setSelectedUsers([])}>Cancel</Button>
          </Space>
        </div>
      )}

      {/* Main Grid Display */}
      <Card className="shadow-sm border-gray-200 rounded-xl overflow-hidden" styles={{ body: { padding: 0 } }}>
        
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="id"
            rowSelection={{
              selectedRowKeys: selectedUsers,
              onChange: (keys) => setSelectedUsers(keys),
            }}
            loading={loading}
            scroll={{ x: 800 }}
            locale={{
              emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No user accounts registered" />,
            }}
            pagination={{
              pageSize: 8,
              showSizeChanger: false,
               placement: "bottomCenter",
              className: "py-4",
            }}
          />
        </div>

        {/* Mobile Cards Grid View */}
        <div className="block md:hidden p-3 bg-gray-50">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Badge status="processing" text="Refreshing account registry..." />
            </div>
          ) : filteredUsers.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No user accounts found matching query" />
          ) : (
            <div className="space-y-3">
              {/* Select All on Mobile */}
              <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 select-none">
                <Checkbox
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={handleSelectAllMobile}
                >
                  <span className="text-xs font-semibold text-gray-700">Select All ({filteredUsers.length})</span>
                </Checkbox>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mobile List View</span>
              </div>
              
              <Row gutter={[12, 12]}>
                {filteredUsers.map((u) => {
                  return (
                    <Col span={24} key={u.id}>
                      <Card 
                        className="border border-gray-200 rounded-lg shadow-sm"
                        styles={{ body: { padding: "12px" } }}
                        actions={[
                          <EditOutlined key="edit" className="text-amber-500" onClick={() => openEditModal(u)} />,
                          <Popconfirm
                            key="block"
                            title={u.is_blocked ? "Unblock Account?" : "Block Account?"}
                            onConfirm={() => handleBlockUser(u)}
                            okText="Yes"
                            cancelText="No"
                          >
                            {u.is_blocked ? (
                              <UnlockOutlined className="text-green-500" />
                            ) : (
                              <LockOutlined className="text-red-500" />
                            )}
                          </Popconfirm>,
                          <Popconfirm
                            key="delete"
                            title="Delete User"
                            description="Permanently delete account?"
                            onConfirm={() => deleteUser(u.id)}
                            okButtonProps={{ danger: true }}
                          >
                            <DeleteOutlined className="text-red-500" />
                          </Popconfirm>
                        ]}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={selectedUsers.includes(u.id)}
                            onChange={() => toggleSelect(u.id)}
                            className="mt-1"
                          />
                          <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-center gap-1">
                              <h4 className="font-bold text-sm text-gray-800 truncate">{u.name}</h4>
                              <div className="flex-shrink-0 flex gap-1.5">
                                {getRoleTag(u.role)}
                              </div>
                            </div>
                            <p className="text-xs text-gray-400 truncate mt-0.5">{u.email}</p>
                            
                            <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-gray-100">
                              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Account status</span>
                              {getStatusTag(u.status, u.is_blocked)}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </div>
          )}
        </div>

      </Card>

      {/* Add / Edit Form Modal */}
      <Modal
        title={
          <span className="text-lg font-black text-gray-800">
            {editId ? "Modify User Account" : "Register User Account"}
          </span>
        }
        open={modalOpen}
        onOk={() => formInstance.submit()}
        onCancel={() => setModalOpen(false)}
        confirmLoading={submitLoading}
        okText={editId ? "Save Changes" : "Create Account"}
        cancelText="Cancel"
        okButtonProps={{ className: "bg-indigo-600" }}
        width={500}
        centered
        className="rounded-2xl overflow-hidden"
      >
        <Form
          form={formInstance}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
          initialValues={{ role: "User", status: "Active" }}
        >
          <Form.Item
            name="name"
            label={<span className="text-xs font-bold text-gray-700">Full Name</span>}
            rules={[{ required: true, message: "Enter user's name" }]}
          >
            <Input placeholder="e.g. John Doe" className="h-9 rounded-md" />
          </Form.Item>

          <Form.Item
            name="email"
            label={<span className="text-xs font-bold text-gray-700">Email Address</span>}
            rules={[
              { required: true, message: "Enter email address" },
              { type: "email", message: "Enter a valid email address" }
            ]}
          >
            <Input placeholder="e.g. john@example.com" className="h-9 rounded-md" />
          </Form.Item>

          {!editId && (
            <Form.Item
              name="password"
              label={<span className="text-xs font-bold text-gray-700">Password</span>}
              rules={[{ required: true, message: "Password required" }]}
            >
              <Input.Password placeholder="Enter secure password" className="h-9 rounded-md" />
            </Form.Item>
          )}

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="role"
                label={<span className="text-xs font-bold text-gray-700">System Role</span>}
                rules={[{ required: true }]}
              >
                <Select className="w-full h-9">
                  <Select.Option value="User">User</Select.Option>
                  <Select.Option value="Manager">Manager</Select.Option>
                  <Select.Option value="Admin">Admin</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="status"
                label={<span className="text-xs font-bold text-gray-700">Access Status</span>}
                rules={[{ required: true }]}
              >
                <Select className="w-full h-9">
                  <Select.Option value="Active">Active</Select.Option>
                  <Select.Option value="Inactive">Inactive</Select.Option>
                  <Select.Option value="Blocked">Blocked</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

    </div>
   </ProtectedRoute>
  );
}