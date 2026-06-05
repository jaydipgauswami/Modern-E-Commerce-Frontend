"use client";

import React, { useState, useEffect, useMemo } from "react";
import ProtectedRoute from "../../../component/ProtectedRoute";
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Space, 
  Row, 
  Col, 
  Tooltip, 
  Popconfirm, 
  message, 
  Empty,
  Form
} from "antd";
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  CloseOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { apiFetch } from "../../api/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  
  // Form input states
  const [name, setName] = useState("");
  const [editCategory, setEditCategory] = useState(null);
  const [editName, setEditName] = useState("");
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Categories from Backend API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("http://localhost:5000/api/catagories");
      setCategories(data.categories || []);
    } catch (error) {
      console.error(error);
      message.error("Failed to load categories catalog");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCategories();
  }, []);

  // Client-side search filtering
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    return categories.filter((cat) => 
      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  // Handle Add Category Submission
  const handleSubmit = async () => {
    if (!name.trim()) {
      message.warning("Please enter a category name");
      return;
    }

    setSubmitLoading(true);
    try {
      await apiFetch("http://localhost:5000/api/catagories", {
        method: "POST",
        body: JSON.stringify({ name: name.trim() }),
      });

      message.success("Category added successfully");
      setName("");
      await fetchCategories();
    } catch (error) {
      message.error(error.message || "Failed to add category");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle Update Category Submission
  const handleUpdate = async () => {
    if (!editName.trim()) {
      message.warning("Please enter a category name");
      return;
    }

    setSubmitLoading(true);
    try {
      await apiFetch(`http://localhost:5000/api/catagories/${editCategory.id}`, {
        method: "PUT",
        body: JSON.stringify({ name: editName.trim() }),
      });

      message.success("Category updated successfully");
      setEditCategory(null);
      setEditName("");
      await fetchCategories();
    } catch (error) {
      message.error(error.message || "Failed to update category");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle Delete Action
  const handleDelete = async (id) => {
    try {
      await apiFetch(`http://localhost:5000/api/catagories/${id}`, {
        method: "DELETE",
      });

      message.success("Category deleted successfully");
      await fetchCategories();
    } catch (error) {
      message.error(error.message || "Failed to delete category");
    }
  };

  const handleEdit = (cat) => {
    setEditCategory(cat);   // Store selected category object
    setEditName(cat.name);  // Populate edit input value
  };

  // Desktop Table Columns configuration
  const columns = [
  
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <span className="font-semibold text-gray-800">{text}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined className="text-amber-500 hover:scale-110 transition-transform" />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete Category"
              description={`Delete "${record.name}" permanently?`}
              onConfirm={() => handleDelete(record.id)}
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
      
      {/* Title Header area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Categories Management
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Create, edit, and organize product categories for your store catalog.
          </p>
        </div>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={fetchCategories} 
          loading={loading}
          className="rounded-lg flex items-center h-10 w-full sm:w-auto justify-center bg-white border-gray-200"
        >
          Refresh Data
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        
        {/* Left Side: Category Create/Edit Card Form */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <span className="text-sm font-bold text-gray-800">
                {editCategory ? "Modify Category" : "Create Category"}
              </span>
            }
            className="shadow-sm border-gray-200 rounded-xl"
            styles={{ body: { padding: "20px" } }}
          >
            <Form layout="vertical" onFinish={editCategory ? handleUpdate : handleSubmit}>
              <Form.Item 
                label={<span className="text-xs font-bold text-gray-700">Category Name</span>}
                required
              >
                <Input
                  type="text"
                  placeholder="e.g. Footwear, Electronics"
                  value={editCategory ? editName : name}
                  onChange={(e) => editCategory ? setEditName(e.target.value) : setName(e.target.value)}
                  className="h-10 rounded-lg"
                />
              </Form.Item>

              <Space className="w-full justify-end mt-2">
                {editCategory && (
                  <Button 
                    onClick={() => {
                      setEditCategory(null);
                      setEditName("");
                    }}
                    icon={<CloseOutlined />}
                    className="rounded-lg h-9 flex items-center"
                  >
                    Cancel
                  </Button>
                )}
                
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitLoading}
                  icon={<PlusOutlined />}
                  className="bg-indigo-600 hover:bg-indigo-700 border-none rounded-lg h-9 flex items-center"
                >
                  {editCategory ? "Update" : "Add"}
                </Button>
              </Space>
            </Form>
          </Card>
        </Col>

        {/* Right Side: Category Registry List Table Card */}
        <Col xs={24} lg={16}>
          <Card 
            className="shadow-sm border-gray-200 rounded-xl overflow-hidden"
            styles={{ body: { padding: 0 } }}
          >
            {/* Table Search Filtering Utility header */}
            <div className="p-4 bg-white border-b border-gray-150 flex items-center justify-between gap-4">
              <Input
                prefix={<SearchOutlined className="text-gray-400" />}
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                allowClear
                className="max-w-xs rounded-lg h-9"
              />
              <span className="text-xs text-gray-400 font-medium select-none">
                Total: {filteredCategories.length} categories
              </span>
            </div>

            {/* List Table container */}
            <Table
              dataSource={filteredCategories}
              columns={columns}
              rowKey="id"
              loading={loading}
              scroll={{ x: 500 }}
              locale={{
                emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No categories registered yet" />,
              }}
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                  placement: "bottomCenter",
                className: "py-4",
              }}
            />
          </Card>
        </Col>

      </Row>

    </div>
   </ProtectedRoute>
  );
}