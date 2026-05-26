
"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import {
  Row,
  Col,
  Card,
  Button,
  Spin,
  Empty,
  Input,
  Select,
  Typography,
  message,
  Tag,
   Popconfirm,  
} from "antd";

import {
  ShoppingCartOutlined,
  EyeOutlined,
  SearchOutlined,
  HeartOutlined, HeartFilled,
} from "@ant-design/icons";

const { Meta } = Card;
const { Text, Paragraph, Title } = Typography;
const { Option } = Select;


export default function ProductPage() {
  const [products, setProducts] = useState([]);
const { addToCart,  wishlistItems,
setWishlistItems, handleWishlist,  } = useCart();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  

  const [selectedCategory, setSelectedCategory] =
    useState("all");

  const [searchText, setSearchText] =
    useState("");

  const [sortType, setSortType] =
    useState("latest");

  const router = useRouter();

  // Fetch Products + Categories
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Products API
      const productRes = await fetch(
        "http://localhost:5000/api/products/getproducts"
      );

      const productData = await productRes.json();

      // Categories API
      const categoryRes = await fetch(
        "http://localhost:5000/api/catagories"
      );

      const categoryData = await categoryRes.json();

      setProducts(productData.products || []);

      setCategories(categoryData.categories || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter Products
  let filteredProducts =
    selectedCategory === "all"
      ? [...products]
      : products.filter(
        (p) =>
          Number(p.category_id) ===
          Number(selectedCategory)
      );

  // Search
  if (searchText) {
    filteredProducts = filteredProducts.filter((p) =>
      p.name
        ?.toLowerCase()
        .includes(searchText.toLowerCase())
    );
  }

  // Sort
  if (sortType === "priceLow") {
    filteredProducts.sort(
      (a, b) => a.price - b.price
    );
  } else if (sortType === "priceHigh") {
    filteredProducts.sort(
      (a, b) => b.price - a.price
    );
  }

  // Loading State
  if (loading) {
    return (
      <div
        style={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }



  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "24px",
      }}
    >
      {/* HEADER */}


      {/* FILTER BAR */}
      <Card
        variant="borderless"
        style={{
          marginBottom: "24px",
          borderRadius: "16px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.06)",
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          {/* Search */}
          <Col xs={24} md={10}>
            <Input
              size="large"
              placeholder="Search products..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) =>
                setSearchText(e.target.value)
              }
            />
          </Col>

          {/* Sort */}
          <Col xs={24} sm={12} md={6}>
            <Select
              size="large"
              value={sortType}
              onChange={(value) =>
                setSortType(value)
              }
              style={{ width: "100%" }}
            >
              <Option value="latest">
                Latest
              </Option>

              <Option value="priceLow">
                Price: Low to High
              </Option>

              <Option value="priceHigh">
                Price: High to Low
              </Option>
            </Select>
          </Col>

          {/* Category */}
          <Col xs={24} sm={12} md={8}>
            <Select
              size="large"
              value={selectedCategory}
              onChange={(value) =>
                setSelectedCategory(value)
              }
              style={{ width: "100%" }}
            >
              <Option value="all">
                All Categories
              </Option>

              {categories.map((cat) => (
                <Option
                  key={cat.id}
                  value={cat.id}
                >
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>


      {/* PRODUCTS */}
      {filteredProducts.length === 0 ? (
        <Empty description="No Products Found" />
      ) : (
        <Row gutter={[24, 24]}>
          {filteredProducts.map((p) => (
            <Col
              xs={24}
              sm={12}
              md={8}
              lg={6}
              key={p.id}
              styles={{
                body: {
                  padding: "24px",
                },
              }}
            >
              <Card
                hoverable
                variant="borderless"
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
                styles={{
                  body: {
                    padding: "14px",
                  },
                }}
                cover={
                  <div
                    onClick={() =>
                      router.push(`/products/${p.id}`)
                    }
                    style={{
                      cursor: "pointer",
                      padding: "8px",
                        position: "relative",
                    }}
                  >
      <Popconfirm
  title={
        wishlistItems.some(
  (item) => item.id === p.id
)
      ? "Remove from Wishlist"
      : "Add to Wishlist"
  }
  description={
        wishlistItems.some(
  (item) => item.id === p.id
)
      ? "Do you want to remove this item?"
      : "Do you want to add this item?"
  }
  okText="Done"
  cancelText="Cancel"
  onConfirm={(e) => {
    e?.stopPropagation();
    handleWishlist(p);
  }}
  onCancel={(e) => {
    e?.stopPropagation();
  }}
  onPopupClick={(e) => e.stopPropagation()}
>
  <div
    onClick={(e) => e.stopPropagation()}
    style={{
      position: "absolute",
      top: 12,
      right: 12,
      zIndex: 10,
      cursor: "pointer",
    }}
  >
    <div
      style={{
        position: "relative",
        width: "38px",
        height: "38px",
        borderRadius: "50%",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      {    wishlistItems.some(
  (item) => item.id === p.id
) ? (
        <HeartFilled
          style={{
            fontSize: "22px",
            color: "#ff4d4f",
          }}
        />
      ) : (
        <HeartOutlined
          style={{
            fontSize: "22px",
            color: "#333",
          }}
        />
      )}

      {!    wishlistItems.some(
  (item) => item.id === p.id
) && (
        <span
          style={{
            position: "absolute",
            bottom: 2,
            right: 2,
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            background: "#2874f0",
            color: "#fff",
            fontSize: "11px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          +
        </span>
      )}
    </div>
  </div>
</Popconfirm>
                    <img
                      alt={p.name}
                      src={`http://localhost:5000/uploads/${p.image}`}
                      style={{
                        width: "100%",
                        height: "240px",
                        objectFit: "cover",
                        borderRadius: "14px",
                      }}
                    />
                  </div>
                }
              >
                <Tag
                    color="purple"
                    style={{
                      fontSize: "17px",
                    }}
                  >
                    {p.brand}
                  </Tag>

                <div style={{ marginTop: "8px" }}>
                 
                   <Meta
                  title={
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "18px",
                      }}
                    >
                      {p.name}
                    </h2>
                  }
                />

                  <br />

                  <Text
                    strong
                    style={{
                      fontSize: "20px",
                      color: "green",
                    }}
                  >
                    ₹ {p.price}
                  </Text>

                  <Paragraph
                    ellipsis={{ rows: 1 }}
                    style={{
                      marginTop: "6px",
                      marginBottom: "10px",
                      color: "#555",
                    }}
                  >
                    {p.description}
                  </Paragraph>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  <Button
                    type="primary"
                    size="middle"
                    block
                    onClick={() => addToCart(p, 1)}
                  >
                    Add
                  </Button>

                  <Button
                    size="middle"
                    block
                    onClick={() =>
                      router.push(`/products/${p.id}`)
                    }
                  >
                    Details
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

