"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import {
  Row,
  Col,
  Card,
  Button,
  Spin,
  Empty,
  Input,
  Select,
} from "antd";

const { Meta } = Card;
const { Search } = Input;
const { Option } = Select;

export default function ProductList({ selectedCategory }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [sortType, setSortType] = useState("latest");

  const router = useRouter();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "http://localhost:5000/api/products/getproducts"
        );
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  // 🔍 FILTER + SEARCH + SORT
  let filtered =
    selectedCategory === "all"
      ? products
      : products.filter(
          (p) => Number(p.category_id) === Number(selectedCategory)
        );

  // search
  if (searchText) {
    filtered = filtered.filter((p) =>
      p.name?.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  // sort
  if (sortType === "priceLow") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortType === "priceHigh") {
    filtered.sort((a, b) => b.price - a.price);
  }

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <Spin size="large" />
      </div>
    );
  }

  if (filtered.length === 0) {
    return <Empty description="No Products Found" />;
  }

  return (
    <>
      {/*  TOP BAR */}
      <div className="flex justify-between mb-5">
       
         <input
        type="text"
        placeholder="Search products..."
         onChange={(e) => setSearchText(e.target.value)}
        className="w-80 border px-4 py-2 rounded-lg focus:outline-none"
      />


        <Select
          value={sortType}
          onChange={(value) => setSortType(value)}
          style={{ width: 180 }}
        >
          <Option value="latest">Latest</Option>
          <Option value="priceLow">Price: Low to High</Option>
          <Option value="priceHigh">Price: High to Low</Option>
        </Select>
      </div>

      {/* PRODUCTS */}
      <Row gutter={[16, 16]}>
        {filtered.map((p) => (
          <Col xs={24} sm={12} md={8} lg={6} key={p.id}>
            <Card
              hoverable
              variant="outlined"
              cover={
                <div
                  onClick={() => router.push(`/products/${p.id}`)}
                  style={{ height: 180, overflow: "hidden", cursor: "pointer" }}
                >
                  <img
                    alt={p.name}
                    src={`http://localhost:5000/uploads/${p.image}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              }
            >
              <Meta
                title={<span style={{ fontSize: "14px" }}>{p.name}</span>}
                description={
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    ₹{p.price}
                  </span>
                }
              />

              <Button
                type="primary"
                block
                style={{ marginTop: "10px" }}
                onClick={() => addToCart(p, 1)}
              >
                Add to Cart
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}