"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  Button,
  Input,
  Select,
  Card,
  Tag,
  Badge,
  Space,
  Row,
  Col,
  Statistic,
  Tooltip,
  Empty,
  Form,
  InputNumber,
  Upload,
  Popconfirm,
  Modal,
  Image,
  message,
  List,
  Alert
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ReloadOutlined,
  ExportOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { parseJwt, isTokenExpired, refreshToken } from '../../utils/auth';
import ProtectedRoute from "../../../component/ProtectedRoute";

const PAGE_SIZE = 6;

export default function AdminProducts() {
  const router = useRouter();
  
  // Products states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allProductsList, setAllProductsList] = useState([]); // Used for overall catalog stats & CSV exports
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Search, Filters & Sorting
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockStatusFilter, setStockStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); 

  // Image Upload State
  const [formImage, setFormImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  // Product View Detail Modal
  const [viewProduct, setViewProduct] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Bulk Actions
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Form Instance
  const [formInstance] = Form.useForm();

  // Helper: check and refresh tokens
  const getValidToken = async () => {
    let token = localStorage.getItem("token");
    if (!token) {
      message.error("Authentication token not found. Redirecting to login...");
      router.push("/login");
      return null;
    }
    try {
      if (isTokenExpired(token)) {
        console.log("Token expired, refreshing...");
        token = await refreshToken();
        if (!token) {
          message.error("Session expired. Redirecting to login...");
          router.push("/login");
          return null;
        }
      }
      return token;
    } catch (err) {
      console.error("Token verification error:", err);
      message.error("Failed to authenticate session. Please log in again.");
      router.push("/login");
      return null;
    }
  };

  // Fetch paginated products (matches backend pagination params)
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
       const token = await getValidToken();

    if (!token) {
      return;
    }
      let url = `http://localhost:5000/api/products/getproducts?search=${encodeURIComponent(search)}&page=${page}&limit=${PAGE_SIZE}`;
      
      if (categoryFilter) {
        url += `&category_id=${categoryFilter}`;
      }

       const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
      const data = await res.json();

      if (data.success) {
        setProducts(data.products || []);
        setTotalPages(Number(data.totalPages) || 0);
        setPage(Number(data.currentPage) || 1);
      } else {
        setProducts([]);
        setTotalPages(0);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load products. Please check the database/server connection.");
      message.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all products (with high limit) to compile overall counts, recent additions, and CSV data
  const fetchAllProductsForStats = async () => {
    try {
       const token = await getValidToken();

    if (!token) return;

      const res = await fetch("http://localhost:5000/api/products/getproducts?limit=100000" ,
         {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      const data = await res.json();
      console.log("API Response:", data);
      if (data.success && Array.isArray(data.products)) {
        setAllProductsList(data.products);
      }
    } catch (err) {
      console.error("Failed to fetch full stats list:", err);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
       const token = await getValidToken();

    if (!token) return;

      const res = await fetch("http://localhost:5000/api/catagories" , 
          {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to load categories");
    }
  };

  // Category name helper
  const getCategoryName = (id) => {
    const category = categories.find((cat) => cat.id === id);
    return category ? category.name : "N/A";
  };

  // Load initial configurations
  useEffect(() => {
    fetchCategories();
    fetchAllProductsForStats();
  }, []);

  // Reset pagination index when typing search queries or switching filters
  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter]);

  // Sync data updates on search, filters, or page index moves
  useEffect(() => {
    fetchProducts();
  }, [search, categoryFilter, page]);

  // Client-side Stock Filtering & Sorting applied to current page results
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // 1. Stock Filter
    if (stockStatusFilter) {
      if (stockStatusFilter === "inStock") {
        list = list.filter((p) => p.stock >= 5);
      } else if (stockStatusFilter === "lowStock") {
        list = list.filter((p) => p.stock > 0 && p.stock < 5);
      } else if (stockStatusFilter === "outOfStock") {
        list = list.filter((p) => p.stock === 0);
      }
    }

    // 2. Client-side Sort
    if (sortBy) {
      list.sort((a, b) => {
        if (sortBy === "priceAsc") return a.price - b.price;
        if (sortBy === "priceDesc") return b.price - a.price;
        if (sortBy === "stockAsc") return a.stock - b.stock;
        if (sortBy === "stockDesc") return b.stock - a.stock;
        if (sortBy === "nameAsc") return a.name.localeCompare(b.name);
        if (sortBy === "nameDesc") return b.name.localeCompare(a.name);
        return 0;
      });
    }

    return list;
  }, [products, stockStatusFilter, sortBy]);

  // Inventory Metrics
  const stats = useMemo(() => {
    const list = allProductsList.length > 0 ? allProductsList : products;
    return {
      total: list.length,
      inStock: list.filter((p) => p.stock >= 5).length,
      lowStock: list.filter((p) => p.stock > 0 && p.stock < 5).length,
      outOfStock: list.filter((p) => p.stock === 0).length,
    };
  }, [allProductsList, products]);

  // Recently Added Products (Top 5 based on key ordering or timestamp)
  const recentProducts = useMemo(() => {
    if (allProductsList.length === 0) return [];
    return [...allProductsList]
      .sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return String(b.id).localeCompare(String(a.id));
      })
      .slice(0, 5);
  }, [allProductsList]);

  // Add / Edit submission
  const handleSubmit = async (values) => {
    try {
      const token = await getValidToken();
      if (!token) return;

      setSubmitLoading(true);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", values.price);
      formData.append("stock", values.stock);
      formData.append("brand", values.brand || "");
      formData.append("description", values.description || "");
      formData.append("category_id", values.category_id);

      if (formImage) {
        formData.append("image", formImage);
      }

      const url = isEditMode
        ? `http://localhost:5000/api/products/${editId}`
        : "http://localhost:5000/api/products";

      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        message.success(isEditMode ? "Product updated successfully" : "Product created successfully");
        setOpen(false);
        formInstance.resetFields();
        setFormImage(null);
        setImagePreviewUrl("");
        setPage(1);
        fetchProducts();
        fetchAllProductsForStats();
      } else {
        message.error(data.message || "Failed to save product");
      }
    } catch (err) {
      console.error(err);
      message.error("Something went wrong processing your request");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Single Item Delete
  const handleDelete = async (id) => {
    try {
      const token = await getValidToken();
      if (!token) return;

      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        message.error(data.message || "Delete failed");
        return;
      }

      message.success("Product deleted successfully");
      
      // Keep row selection updated
      setSelectedRowKeys((prev) => prev.filter((key) => key !== id));
      
      fetchProducts();
      fetchAllProductsForStats();
    } catch (err) {
      console.error(err);
      message.error("Delete operation failed");
    }
  };

  // Bulk Delete Actions
  const handleBulkDelete = async () => {
    try {
      const token = await getValidToken();
      if (!token) return;

      setLoading(true);
      let successCount = 0;
      let failCount = 0;

      await Promise.all(
        selectedRowKeys.map(async (id) => {
          try {
            const res = await fetch(`http://localhost:5000/api/products/${id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            if (res.ok) successCount++;
            else failCount++;
          } catch {
            failCount++;
          }
        })
      );

      if (successCount > 0) {
        message.success(`Successfully deleted ${successCount} products`);
      }
      if (failCount > 0) {
        message.error(`Failed to delete ${failCount} products`);
      }

      setSelectedRowKeys([]);
      fetchProducts();
      fetchAllProductsForStats();
    } catch (err) {
      console.error(err);
      message.error("Bulk delete action failed");
    } finally {
      setLoading(false);
    }
  };

  // Export Products Catalog to CSV
  const handleExportCSV = () => {
    const dataToExport = allProductsList.length > 0 ? allProductsList : products;
    if (dataToExport.length === 0) {
      message.warning("No products available to export");
      return;
    }

    const headers = ["ID", "Name", "Brand", "Category", "Price (INR)", "Stock", "Description"];
    const rows = dataToExport.map((p) => [
      p.id,
      p.name,
      p.brand || "N/A",
      getCategoryName(p.category_id),
      p.price,
      p.stock,
      (p.description || "N/A").replace(/"/g, '""'),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((val) => `"${val}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `store_inventory_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success("Products list exported to CSV!");
  };

  // Dialog triggers
  const handleAddNew = () => {
    setIsEditMode(false);
    setEditId(null);
    formInstance.resetFields();
    setFormImage(null);
    setImagePreviewUrl("");
    setOpen(true);
  };

  const handleEdit = (product) => {
    setIsEditMode(true);
    setEditId(product.id);
    
    formInstance.setFieldsValue({
      name: product.name,
      price: product.price,
      stock: product.stock,
      brand: product.brand || "",
      description: product.description || "",
      category_id: product.category_id,
    });

    if (product.image) {
      setImagePreviewUrl(`http://localhost:5000/uploads/${product.image}`);
    } else {
      setImagePreviewUrl("");
    }
    setFormImage(null);
    setOpen(true);
  };

  const handleViewDetails = (product) => {
    setViewProduct(product);
    setIsViewOpen(true);
  };

  // File Upload Helper
  const beforeUploadImage = (file) => {
    const isImageFormat = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/webp";
    if (!isImageFormat) {
      message.error("You can only upload JPG/PNG/WEBP image files!");
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image file size must be smaller than 2MB!");
      return Upload.LIST_IGNORE;
    }

    setFormImage(file);
    
    // Create base64 preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    return false; // Prevent automatic background upload
  };

  // Row selection handler
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  // Desktop Table Columns
  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 80,
      render: (img, record) => (
        img ? (
          <Image
            src={`http://localhost:5000/uploads/${img}`}
            alt={record.name}
            width={48}
            height={48}
            className="rounded object-cover border shadow-sm"
            fallback="https://placehold.co/60x60?text=No+Image"
          />
        ) : (
          <div className="w-48px h-48px bg-gray-50 rounded flex items-center justify-center border border-dashed text-gray-400 text-[10px]">
            No Image
          </div>
        )
      ),
    },
    {
      title: "Product Name",
      dataIndex: "name",
      width:100,
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <span className="font-semibold text-gray-800 ">{text}</span>,
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      render: (brand) => <Tag color="blue" className="rounded-full px-3">{brand || "N/A"}</Tag>,
    },
    {
      title: "Category",
      dataIndex: "category_id",
      key: "category_id",
      width:120,
      render: (catId) => <Tag color="purple" className="rounded-full px-3">{getCategoryName(catId)}</Tag>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price) => <span className="font-bold text-indigo-600">₹{Number(price).toLocaleString("en-IN")}</span>,
    },
    {
      title: "Stock Status",
      dataIndex: "stock",
      key: "stock",
      sorter: (a, b) => a.stock - b.stock,
      render: (stock) => {
        let tagColor = "success";
        let label = "In Stock";
        if (stock === 0) {
          tagColor = "error";
          label = "Out of Stock";
        } else if (stock < 5) {
          tagColor = "warning";
          label = "Low Stock";
        }
        return (
          <Space orientation="vertical" size={1}>
            <span className={`text-xs font-semibold ${stock < 5 ? "text-red-500 font-bold" : "text-gray-700"}`}>
              {stock} units
            </span>
            <Badge status={tagColor} text={<span className="text-[11px] text-gray-500">{label}</span>} />
          </Space>
        );
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (desc) => (
        <Tooltip title={desc || "No Description"}>
          <span className="text-gray-400 text-xs">{desc || "N/A"}</span>
        </Tooltip>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 130,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Info">
            <Button 
              type="text" 
              icon={<EyeOutlined className="text-blue-500 hover:scale-110 transition-transform" />} 
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Modify">
            <Button 
              type="text" 
              icon={<EditOutlined className="text-amber-500 hover:scale-110 transition-transform" />} 
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Remove">
            <Popconfirm
              title="Delete Product"
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
     <div className="p-4 sm:p-6 max-w-7xl mx-auto bg-gray-50 overflow-hidden">
      
      {/* Header section */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          product Management
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Real-time control interface for your store catalog, analytics, and stock levels.
          </p>
        </div>
        <Button 
          type="primary" 
          size="large"
          icon={<PlusOutlined />} 
          onClick={handleAddNew}
          className="bg-indigo-600 hover:bg-indigo-700 border-none shadow-sm rounded-lg flex items-center h-11"
        >
          Add Product
        </Button>
      </div>

      {/* Error Alert Display */}
      {error && (
        <Alert
          message="Server Sync Error"
          description={error}
          type="error"
          showIcon
          closable
          className="mb-6 rounded-lg shadow-sm"
          action={
            <Button size="small" type="primary" danger onClick={fetchProducts}>
              Retry Fetch
            </Button>
          }
        />
      )}

      {/* Statistics Cards Row */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow duration-300 border-l-4 border-l-indigo-500 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1">Total Products</p>
                <h3 className="text-lg sm:text-2xl font-black text-gray-800">{stats.total}</h3>
              </div>
              <div className="p-2 sm:p-3 bg-indigo-50 text-indigo-500 rounded-lg">
                <ShoppingOutlined className="text-lg sm:text-2xl" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow duration-300 border-l-4 border-l-green-500 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1">In Stock</p>
                <h3 className="text-lg sm:text-2xl font-black text-green-600">{stats.inStock}</h3>
              </div>
              <div className="p-2 sm:p-3 bg-green-50 text-green-500 rounded-lg">
                <CheckCircleOutlined className="text-lg sm:text-2xl" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow duration-300 border-l-4 border-l-orange-500 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1">Low Stock</p>
                <h3 className="text-lg sm:text-2xl font-black text-orange-600">{stats.lowStock}</h3>
              </div>
              <div className="p-2 sm:p-3 bg-orange-50 text-orange-500 rounded-lg">
                <WarningOutlined className="text-lg sm:text-2xl" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow duration-300 border-l-4 border-l-red-500 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1">Out of Stock</p>
                <h3 className="text-lg sm:text-2xl font-black text-red-600">{stats.outOfStock}</h3>
              </div>
              <div className="p-2 sm:p-3 bg-red-50 text-red-500 rounded-lg">
                <CloseCircleOutlined className="text-lg sm:text-2xl" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bulk actions banner */}
      {selectedRowKeys.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-150 rounded-xl p-4 mb-6 flex justify-between items-center animate-pulse">
          <div className="flex items-center gap-2">
            <InfoCircleOutlined className="text-indigo-600 text-base" />
            <span className="text-indigo-800 text-xs sm:text-sm font-medium">
              {selectedRowKeys.length} product(s) selected
            </span>
          </div>
          <Space>
            <Popconfirm
              title="Delete Selected Items"
              description={`Delete all ${selectedRowKeys.length} selected items permanently?`}
              onConfirm={handleBulkDelete}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button type="primary" danger size="small" icon={<DeleteOutlined />}>
                Bulk Delete
              </Button>
            </Popconfirm>
            <Button size="small" onClick={() => setSelectedRowKeys([])}>Cancel</Button>
          </Space>
        </div>
      )}

      {/* Main Grid: Filters & Product Records */}
      <Row gutter={[24, 24]}>
        
        {/* Left/Center Main content panel */}
        <Col xs={24} lg={18}>
          <Card className="shadow-sm border-gray-200 rounded-xl overflow-hidden">
            
            {/* Filter and Control Toolbar */}
            <div className="p-4 bg-white border-b border-gray-150 flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <Input
                  prefix={<SearchOutlined className="text-gray-400" />}
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  allowClear
                  className="rounded-lg h-10"
                />
                
                <Select
                  placeholder="All Categories"
                  value={categoryFilter}
                  onChange={(val) => setCategoryFilter(val || "")}
                  allowClear
                  className="w-full h-10"
                >
                  <Select.Option value="">All Categories</Select.Option>
                  {categories.map((c) => (
                    <Select.Option key={c.id} value={c.id}>
                      {c.name}
                    </Select.Option>
                  ))}
                </Select>
                
                <Select
                  placeholder="Stock Status"
                  value={stockStatusFilter}
                  onChange={(val) => setStockStatusFilter(val || "")}
                  allowClear
                  className="w-full h-10"
                >
                  <Select.Option value="">All Stock Statuses</Select.Option>
                  <Select.Option value="inStock">In Stock (5+ units)</Select.Option>
                  <Select.Option value="lowStock">Low Stock (1-4 units)</Select.Option>
                  <Select.Option value="outOfStock">Out of Stock</Select.Option>
                </Select>
                
                <Select
                  placeholder="Sort By"
                  value={sortBy}
                  onChange={(val) => setSortBy(val || "")}
                  allowClear
                  className="w-full h-10"
                >
                  <Select.Option value="">Default Sort</Select.Option>
                  <Select.Option value="nameAsc">Name: A - Z</Select.Option>
                  <Select.Option value="nameDesc">Name: Z - A</Select.Option>
                  <Select.Option value="priceAsc">Price: Low to High</Select.Option>
                  <Select.Option value="priceDesc">Price: High to Low</Select.Option>
                  <Select.Option value="stockAsc">Stock: Low to High</Select.Option>
                  <Select.Option value="stockDesc">Stock: High to Low</Select.Option>
                </Select>
              </div>

              {/* CSV export / Refresh */}
              <div className="flex justify-between items-center flex-wrap gap-2 pt-2 border-t border-gray-50">
                <span className="text-[11px] text-gray-400 font-medium">
                  Showing {filteredProducts.length} items (Page {page} of {totalPages})
                </span>
                <Space>
                  <Button 
                    icon={<ReloadOutlined />} 
                    onClick={() => {
                      fetchProducts();
                      fetchAllProductsForStats();
                    }}
                    loading={loading}
                    className="rounded-lg flex items-center h-8"
                  >
                    Refresh
                  </Button>
                  <Button 
                    icon={<ExportOutlined />} 
                    onClick={handleExportCSV}
                    className="rounded-lg flex items-center h-8"
                  >
                    Export CSV
                  </Button>
                </Space>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table
                columns={columns}
                dataSource={filteredProducts}
                rowKey="id"
                rowSelection={rowSelection}
                loading={loading}
                locale={{
                  emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No inventory items found" />,
                }}
                pagination={{
                  current: page,
                  pageSize: PAGE_SIZE,
                  total: totalPages * PAGE_SIZE,
                  onChange: (p) => setPage(p),
                  showSizeChanger: false,
                  placement: "bottomCenter",
                  className: "py-4",
                }}
              />
            </div>

            {/* Mobile Cards Grid View */}
            <div className="block md:hidden p-4 bg-gray-50">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Badge status="processing" text="Fetching updates..." />
                </div>
              ) : filteredProducts.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No items found matching the filter criteria" />
              ) : (
                <Row gutter={[12, 12]}>
                  {filteredProducts.map((p) => {
                    const isOutOfStock = p.stock === 0;
                    const isLowStock = p.stock > 0 && p.stock < 5;
                    return (
                      <Col span={24} key={p.id}>
                        <Card 
                          className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                          actions={[
                            <EyeOutlined key="view" className="text-blue-500" onClick={() => handleViewDetails(p)} />,
                            <EditOutlined key="edit" className="text-amber-500" onClick={() => handleEdit(p)} />,
                            <Popconfirm
                              key="delete"
                              title="Delete Item"
                              description="Delete this product catalog entry?"
                              onConfirm={() => handleDelete(p.id)}
                              okButtonProps={{ danger: true }}
                            >
                              <DeleteOutlined className="text-red-500" />
                            </Popconfirm>
                          ]}
                        >
                          <div className="flex gap-3">
                            <div className="flex-shrink-0">
                              {p.image ? (
                                <Image
                                  src={`http://localhost:5000/uploads/${p.image}`}
                                  alt={p.name}
                                  width={64}
                                  height={64}
                                  className="rounded object-cover border"
                                  fallback="https://placehold.co/60x60?text=No+Image"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center border text-gray-400 text-xs">
                                  No img
                                </div>
                              )}
                            </div>
                            <div className="flex-grow min-w-0">
                              <div className="flex justify-between items-start gap-1">
                                <h4 className="font-bold text-sm text-gray-800 truncate">{p.name}</h4>
                                <Tag 
                                  color={isOutOfStock ? "red" : isLowStock ? "orange" : "green"}
                                  className="text-[9px] px-1.5 py-0 border-none rounded-full flex-shrink-0"
                                >
                                  {isOutOfStock ? "Out" : isLowStock ? "Low" : "In Stock"}
                                </Tag>
                              </div>
                              <p className="text-[10px] text-gray-400 truncate mt-0.5">
                                {p.brand || "Generic"} • {getCategoryName(p.category_id)}
                              </p>
                              <div className="flex justify-between items-baseline mt-2">
                                <span className="font-bold text-sm text-indigo-600">
                                  ₹{Number(p.price).toLocaleString("en-IN")}
                                </span>
                                <span className="text-[10px] text-gray-500 font-medium">
                                  Qty: <strong className={isLowStock ? "text-red-500" : "text-gray-800"}>{p.stock}</strong>
                                </span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              )}

              {/* Mobile pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                  <Button 
                    size="small" 
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  >
                    Prev
                  </Button>
                  <span className="text-xs text-gray-600">
                    {page} of {totalPages}
                  </span>
                  <Button 
                    size="small"
                    disabled={page === totalPages}
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>

          </Card>
        </Col>

        {/* Right Sidebar Section */}
        <Col xs={24} lg={6}>
          <div className="flex flex-col gap-6">
            
            {/* Recently Added Section */}
            <Card
              title={<span className="text-sm font-bold text-gray-800">Recently Added</span>}
              className="shadow-sm border-gray-200 rounded-xl"
               styles={{
    body: {
      padding: "12px",
    },
  }}
            >
              {recentProducts.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No recent products" />
              ) : (
               <div className="space-y-2">
  {recentProducts.map((p) => (
    <div
      key={p.id}
      className="hover:bg-gray-50 p-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 border-b border-gray-50"
      onClick={() => handleViewDetails(p)}
    >
      <div className="flex-shrink-0">
        {p.image ? (
          <img
            src={`http://localhost:5000/uploads/${p.image}`}
            alt={p.name}
            className="w-10 h-10 rounded object-cover border"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/40x40?text=No+Image";
            }}
          />
        ) : (
          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center border text-gray-400 text-[10px]">
            N/A
          </div>
        )}
      </div>

      <div className="flex-grow min-w-0">
        <div className="font-semibold text-xs text-gray-800 truncate">
          {p.name}
        </div>

        <div className="text-[10px] text-gray-500 flex justify-between mt-0.5">
          <span>₹{p.price}</span>

          <span
            className={
              p.stock < 5
                ? "text-red-500 font-bold"
                : "text-gray-400"
            }
          >
            Qty: {p.stock}
          </span>
        </div>
      </div>
    </div>
  ))}
</div>
              )}
            </Card>

            {/* Inventory Status/Health Overview */}
            <Card
              title={<span className="text-sm font-bold text-gray-800">Product Catalog Status</span>}
              className="shadow-sm border-gray-200 rounded-xl"
                 styles={{
    body: {
      padding: "16px",
    },
  }}
              
            >
              <div className="flex flex-col gap-4 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Stock Status</span>
                  <Tag color={stats.outOfStock > 0 ? "red" : "green"} className="rounded-full px-2">
                    {stats.outOfStock > 0 ? `${stats.outOfStock} Empty` : "Stable"}
                  </Tag>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Restock Warnings</span>
                  <Tag color={stats.lowStock > 0 ? "orange" : "green"} className="rounded-full px-2">
                    {stats.lowStock > 0 ? `${stats.lowStock} Warnings` : "No alert"}
                  </Tag>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-150">
                  <span className="text-gray-600 font-semibold">Active Products</span>
                  <span className="font-bold text-gray-800 text-sm">
                    {stats.total > 0 ? Math.round(((stats.total - stats.outOfStock) / stats.total) * 100) : 0}% Active
                  </span>
                </div>
              </div>
            </Card>

          </div>
        </Col>

      </Row>

      {/* View Product Details Modal */}
      <Modal
        title={<span className="text-lg font-black text-gray-800">Inventory Product Specs</span>}
        open={isViewOpen}
        onCancel={() => {
          setIsViewOpen(false);
          setViewProduct(null);
        }}
        footer={[
          <Button key="close" type="primary" onClick={() => {
            setIsViewOpen(false);
            setViewProduct(null);
          }} className="bg-indigo-600">
            Done
          </Button>
        ]}
        width={640}
        centered
        className="rounded-2xl overflow-hidden"
      >
        {viewProduct && (
          <div className="flex flex-col sm:flex-row gap-6 mt-4">
            <div className="flex-shrink-0 flex justify-center items-start mx-auto sm:mx-0">
              {viewProduct.image ? (
                <Image
                  src={`http://localhost:5000/uploads/${viewProduct.image}`}
                  alt={viewProduct.name}
                  width={180}
                  height={180}
                  className="rounded-lg object-cover border shadow-sm"
                  fallback="https://placehold.co/180x180?text=No+Image"
                />
              ) : (
                <div className="w-180px h-180px bg-gray-50 rounded-lg flex items-center justify-center border border-dashed text-gray-400 text-xs">
                  No Image Available
                </div>
              )}
            </div>
            
            <div className="flex-grow min-w-0">
              <h2 className="text-xl font-bold text-gray-900 truncate mb-0.5">{viewProduct.name}</h2>
              <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">{viewProduct.brand || "Generic Brand"}</span>
              
              <div className="grid grid-cols-2 gap-4 text-xs border-t border-gray-150 pt-4 mt-4">
                <div>
                  <span className="text-gray-400 block mb-0.5 uppercase tracking-wide">Category</span>
                  <span className="text-gray-800 font-bold">{getCategoryName(viewProduct.category_id)}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5 uppercase tracking-wide">Unit Retail Price</span>
                  <span className="text-indigo-600 font-extrabold text-sm">
                    ₹{Number(viewProduct.price).toLocaleString("en-IN")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5 uppercase tracking-wide">Warehouse Count</span>
                  <span className="text-gray-800 font-bold">
                    {viewProduct.stock} units
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5 uppercase tracking-wide">Status</span>
                  <Tag 
                    color={viewProduct.stock === 0 ? "red" : viewProduct.stock < 5 ? "orange" : "green"}
                    className="border-none rounded-full px-2"
                  >
                    {viewProduct.stock === 0 ? "Out of stock" : viewProduct.stock < 5 ? "Restock Immediately" : "In Stock"}
                  </Tag>
                </div>
              </div>
              
              <div className="mt-4 border-t border-gray-150 pt-4">
                <span className="text-gray-400 block text-xs uppercase mb-1">Product Description</span>
                <p className="text-gray-700 bg-gray-50 p-2.5 rounded-lg border text-xs leading-relaxed max-h-24 overflow-y-auto">
                  {viewProduct.description || "This catalog item has no write-up description logs."}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add / Edit Form Modal */}
      <Modal
        title={
          <span className="text-lg font-black text-gray-800">
            {isEditMode ? "Modify Catalog Item" : "Create Catalog Entry"}
          </span>
        }
        open={open}
        onOk={() => formInstance.submit()}
        onCancel={() => {
          setOpen(false);
          formInstance.resetFields();
          setFormImage(null);
          setImagePreviewUrl("");
        }}
        confirmLoading={submitLoading}
        okText={isEditMode ? "Save Changes" : "Publish Item"}
        cancelText="Cancel"
        okButtonProps={{ className: "bg-indigo-600" }}
        width={560}
        centered
        className="rounded-2xl overflow-hidden"
      >
        <Form
          form={formInstance}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Row gutter={12}>
            <Col span={24}>
              <Form.Item
                name="name"
                label={<span className="text-xs font-bold text-gray-700">Product Name</span>}
                rules={[{ required: true, message: "Enter product catalog name" }]}
              >
                <Input placeholder="e.g. Air Zoom Sneakers" className="h-9 rounded-md" />
              </Form.Item>
            </Col>
            
            <Col span={24}>
              <Form.Item
                name="brand"
                label={<span className="text-xs font-bold text-gray-700">Brand Name</span>}
              >
                <Input placeholder="e.g. Nike" className="h-9 rounded-md" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="price"
                label={<span className="text-xs font-bold text-gray-700">Unit Price (₹)</span>}
                rules={[
                  { required: true, message: "Price required" },
                  { type: "number", min: 0.01, message: "Must be a positive value", transform: (v) => Number(v) }
                ]}
              >
                <InputNumber className="w-full h-9 rounded-md flex items-center" placeholder="1000" min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="stock"
                label={<span className="text-xs font-bold text-gray-700">Stock Count</span>}
                rules={[
                  { required: true, message: "Stock count required" },
                  { type: "number", min: 0, message: "Cannot be negative", transform: (v) => Number(v) }
                ]}
              >
                <InputNumber className="w-full h-9 rounded-md flex items-center" placeholder="100" min={0} precision={0} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="category_id"
            label={<span className="text-xs font-bold text-gray-700">Store Category</span>}
            rules={[{ required: true, message: "Category selection required" }]}
          >
            <Select placeholder="Select category option" className="w-full h-9">
              {categories.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label={<span className="text-xs font-bold text-gray-700">Product Description</span>}
          >
            <Input.TextArea placeholder="Item inventory spec logs, materials, features..." rows={3} className="rounded-md" />
          </Form.Item>

          <Form.Item
            label={<span className="text-xs font-bold text-gray-700">Product Image Upload</span>}
          >
            <div className="flex items-center gap-4 flex-wrap">
              <Upload
                listType="picture-card"
                showUploadList={false}
                beforeUpload={beforeUploadImage}
                maxCount={1}
              >
                {imagePreviewUrl ? (
                  <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-cover rounded-md" />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center gap-1">
                    <PlusOutlined className="text-base" />
                    <span className="text-[10px] font-semibold">Upload Image</span>
                  </div>
                )}
              </Upload>
              
              {imagePreviewUrl && (
                <Button 
                  type="link" 
                  danger 
                  size="small" 
                  onClick={() => {
                    setFormImage(null);
                    setImagePreviewUrl("");
                  }}
                  className="p-0 text-xs font-semibold text-red-500 hover:text-red-600"
                >
                  Clear Selection
                </Button>
              )}
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
   </ProtectedRoute>
  );
}