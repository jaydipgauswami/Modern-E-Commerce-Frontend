
"use client";
import { useCart } from "@/app/context/CartContext";
import { useEffect, useState, useCallback, useMemo } from "react";
import ProtectedRoute from "../../../component/ProtectedRoute";
import {
  Card,
  Button,
  Typography,
  Divider,
  Modal,
  Skeleton,
  Tooltip,
  Badge,
} from "antd";
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  ArrowRightOutlined,
  ShoppingOutlined,
  HeartOutlined,
  HeartFilled,
  MinusOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  GiftOutlined,
  ExclamationCircleFilled,
  TagOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import "./cart.css";
const { Title, Text, Paragraph } = Typography;

function parsePrice(price) {
  if (typeof price === "number") return price;
  return Number(String(price).replace(/[^0-9.-]+/g, "")) || 0;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
  onWishlist,
  isWishlisted,
  removingId,
}) {
  const itemPrice = parsePrice(item.price);
  const itemTotal = itemPrice * item.quantity;
  const isRemoving = removingId === item.product_id;
  return (
    <Card
      className={`cart-item-card ${isRemoving ? "cart-item-removing" : ""}`}
    >
      <div className="cart-item-inner">
        {/* IMAGE */}
        <div className="cart-item-image-wrap">
          <img
            src={`http://localhost:5000/uploads/${item.image}`}
            alt={item.name}
            className="cart-item-image"
            loading="lazy"
            onError={(e) => {
              e.target.src =
                "https://placehold.co/180x180/f1f5f9/94a3b8?text=No+Image";
            }}
          />
        </div>
        {/* DETAILS */}
        <div className="cart-item-details">
          {/* Top: Name, Brand, Description */}
          <div className="cart-item-top-row">
            <div className="cart-item-info">
              <div className="cart-item-name" title={item.name}>
                {item.name}
              </div>
              {item.brand && (
                <span className="cart-item-brand">{item.brand}</span>
              )}
              {item.description && (
                <Paragraph
                  ellipsis={{ rows: 2 }}
                  className="cart-item-description"
                  style={{ marginTop: 8 }}
                >
                  {item.description}
                </Paragraph>
              )}
            </div>
          </div>
          {/* Bottom: Price, Quantity, Actions */}
          <div className="cart-item-bottom-row">
            <div className="cart-item-price-section">
              <Title level={4} className="cart-item-total-price">
                {formatCurrency(itemTotal)}
              </Title>
              {item.quantity > 1 && (
                <span
                  style={{
                    fontSize: 12,
                    color: "#94a3b8",
                    fontWeight: 500,
                  }}
                >
                  ({formatCurrency(itemPrice)} × {item.quantity})
                </span>
              )}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              {/* Quantity Stepper */}
              <div className="cart-quantity-controls">
                <span className="qty-label">Qty</span>
                <div className="qty-stepper">
                  <button
                    className="qty-btn"
                    onClick={() =>
                      onUpdateQuantity(
                        item.product_id,
                        Math.max(1, item.quantity - 1)
                      )
                    }
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <MinusOutlined style={{ fontSize: 12 }} />
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() =>
                      onUpdateQuantity(item.product_id, item.quantity + 1)
                    }
                    aria-label="Increase quantity"
                  >
                    <PlusOutlined style={{ fontSize: 12 }} />
                  </button>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="cart-item-actions">
                <Tooltip
                  title={
                    isWishlisted
                      ? "Remove from Wishlist"
                      : "Move to Wishlist"
                  }
                >
                <button
  className={`btn-wishlist ${isWishlisted ? "active" : ""}`}
  onClick={() =>  
   {  console.log("Product ID:", item.product_id);
    onWishlist(item)}}
  aria-label="Toggle wishlist"
>
                    {isWishlisted ? (
                      <HeartFilled />
                    ) : (
                      <HeartOutlined />
                    )}
                  </button>
                </Tooltip>
                <Tooltip title="Remove from Cart">
                 <button
  className="btn-remove"
  onClick={() => {
    Modal.confirm({
      title: "Remove Item",
      icon: <ExclamationCircleFilled style={{ color: "#ef4444" }} />,
      content: `Are you sure you want to remove ${item.name} from cart?`,
      okText: "Remove",
      cancelText: "Cancel",
      centered: true,
      onOk: () => onRemove(item.product_id),
    });
  }}
  aria-label="Remove item"
>
  <DeleteOutlined />
</button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
// EmptyCart Component

function EmptyCart({ onContinueShopping }) {
  return (
    <div className="empty-cart">
      <div className="empty-cart-icon">
        <InboxOutlined />
      </div>
      <Title level={3} className="empty-cart-title">
        Your Cart is Empty
      </Title>
      <p className="empty-cart-text">
        Looks like you haven&apos;t added anything to your cart yet. Browse
        our collection and find something you love!
      </p>
      <Button
        type="primary"
        size="large"
        icon={<ShoppingOutlined />}
        className="empty-cart-btn"
        onClick={onContinueShopping}
      >
        Start Shopping
      </Button>
    </div>
  );
}

// Loading Skeleton

function CartSkeleton() {
  return (
    <div className="cart-skeleton">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="cart-skeleton-card">
          <div style={{ display: "flex", gap: 20, padding: 20 }}>
            <div
              style={{
                width: 160,
                height: 160,
                borderRadius: 16,
                background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite",
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
// MAIN CART PAGE
function CartPage() {
  const router = useRouter();
 const {
  cartItems,
  getCart,
  updateQuantity,
  removeFromCart,
  handleWishlist,
  wishlistItems,
} = useCart();

  console.log("Wishlist Items:", wishlistItems);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  // Fetch cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        await getCart();
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
    // Fallback: if getCart doesn't resolve properly, stop loading after 2s
    const timeout = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timeout);
  }, []);
  // Computed values
  const totalQuantity = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );
  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) => acc + parsePrice(item.price) * item.quantity,
        0
      ),
    [cartItems]
  );
  const shipping = subtotal > 999 ? 0 : 99;
  const totalPrice = subtotal + shipping;
  // Check if item is wishlisted


  const isWishlisted = useCallback(
  (item) => {
    if (!Array.isArray(wishlistItems)) return false;

    return wishlistItems.some(
      (wishlistItem) =>
        Number(wishlistItem.id) === Number(item.product_id || item.id)
    );
  },
  [wishlistItems]
);
  
 
  // Handle clear all cart
  const handleClearCart = useCallback(() => {
    Modal.confirm({
      title: "Clear Entire Cart",
      icon: <ExclamationCircleFilled style={{ color: "#ef4444" }} />,
      content:
        "This will remove all items from your cart. Are you sure?",
      okText: "Clear All",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
       await Promise.all(
  cartItems.map((item) => removeFromCart(item.product_id))
);
      },
    });
  }, [cartItems, removeFromCart]);
  const navigateToProducts = () => router.push("/products");
  const navigateToCheckout = () => router.push("/checkout");
  // ==========================================
  // RENDER
  // ==========================================
  return (
    <ProtectedRoute>
      <div className="cart-page">
        {/* -------- HEADER -------- */}
        <div className="cart-header">
          <div className="cart-header-icon">
            <ShoppingCartOutlined />
          </div>
          <Title level={2} className="cart-title">
            Shopping Cart
          </Title>
          <p className="cart-header-subtitle">
            Review your items and proceed to checkout
          </p>
          {!loading && cartItems.length > 0 && (
            <div className="cart-header-count">
              <ShoppingOutlined />
              {totalQuantity} {totalQuantity === 1 ? "item" : "items"} in
              your cart
            </div>
          )}
        </div>
        {/* -------- LOADING STATE -------- */}
        {loading ? (
          <CartSkeleton />
        ) : cartItems.length === 0 ? (
          /* -------- EMPTY STATE -------- */
          <EmptyCart onContinueShopping={navigateToProducts} />
        ) : (
          <>
            {/* -------- CART CONTENT -------- */}
            <div className="cart-content">
              {/* LEFT: Cart Items */}
              <div className="cart-items-column">
                {/* Toolbar */}
                <div className="cart-toolbar">
                  <div className="cart-toolbar-left">
                    <ShoppingOutlined />
                    {cartItems.length}{" "}
                    {cartItems.length === 1 ? "Product" : "Products"}
                  </div>
                  {cartItems.length > 1 && (
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={handleClearCart}
                      style={{ fontWeight: 600 }}
                    >
                      Clear All
                    </Button>
                  )}
                </div>
                {/* Items List */}
                {cartItems.map((item) => (
                  <CartItemCard
                    key={item.id || item.product_id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                    onWishlist={handleWishlist}
                    isWishlisted={isWishlisted(item)}
                    removingId={removingId}
                  />
                ))}
              </div>
              {/* RIGHT: Order Summary */}
              <div className="cart-summary-column">
                <Card className="cart-summary-card">
                  {/* Summary Header */}
                  <div className="summary-header">
                    <div className="summary-header-icon">
                      <TagOutlined />
                    </div>
                    <Title level={4} className="summary-title">
                      Order Summary
                    </Title>
                  </div>
                  <Divider className="summary-divider" />
                  {/* Summary Rows */}
                  <div className="summary-row">
                    <span className="summary-row-label">
                      Subtotal ({totalQuantity}{" "}
                      {totalQuantity === 1 ? "item" : "items"})
                    </span>
                    <span className="summary-row-value">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-row-label">Shipping</span>
                    <span className="summary-row-value">
                      {shipping === 0 ? (
                        <Badge
                          count="FREE"
                          style={{
                            backgroundColor: "#dcfce7",
                            color: "#16a34a",
                            fontWeight: 700,
                            fontSize: 11,
                            boxShadow: "none",
                          }}
                        />
                      ) : (
                        formatCurrency(shipping)
                      )}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <div className="savings-badge">
                      <GiftOutlined />
                      Add {formatCurrency(999 - subtotal)} more for free
                      shipping!
                    </div>
                  )}
                  {shipping === 0 && (
                    <div className="savings-badge">
                      <CheckCircleOutlined />
                      You qualify for free shipping!
                    </div>
                  )}
                  {/* Total */}
                  <div className="summary-row-total">
                    <span className="summary-total-label">Total</span>
                    <Title level={3} className="summary-total-value">
                      {formatCurrency(totalPrice)}
                    </Title>
                  </div>
                  {/* Coupon */}
                  <div className="coupon-section">
                    <Text
                      strong
                      style={{
                        fontSize: 13,
                        display: "block",
                        marginBottom: 8,
                        color: "#475569",
                      }}
                    >
                      Have a Coupon?
                    </Text>
                    <div className="coupon-input-wrap">
                      <input
                        type="text"
                        className="coupon-input"
                        placeholder="Enter code"
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                      />
                      <Button className="coupon-btn" disabled={!couponCode}>
                        Apply
                      </Button>
                    </div>
                  </div>
                  {/* Checkout Button */}
                  <button
                    className="checkout-btn"
                    onClick={navigateToCheckout}
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRightOutlined />
                  </button>
                  {/* Continue Shopping */}
                  <Button
                    className="continue-shopping-btn"
                    icon={<ShoppingOutlined />}
                    onClick={navigateToProducts}
                  >
                    Continue Shopping
                  </Button>
                  {/* Trust Badges */}
                  <div className="trust-badges">
                    <div className="trust-badge">
                      <SafetyCertificateOutlined />
                      <span>Secure SSL Encrypted Checkout</span>
                    </div>
                    <div className="trust-badge">
                      <CheckCircleOutlined />
                      <span>100% Money-Back Guarantee</span>
                    </div>
                    <div className="trust-badge">
                      <GiftOutlined />
                      <span>Free Returns Within 30 Days</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            {/* -------- MOBILE STICKY CHECKOUT BAR -------- */}
            <div className="mobile-checkout-bar">
              <div className="mobile-checkout-price">
                <span className="mobile-checkout-price-label">Total</span>
                <span className="mobile-checkout-price-value">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
              <Button
                type="primary"
                size="large"
                className="mobile-checkout-btn"
                icon={<ArrowRightOutlined />}
                onClick={navigateToCheckout}
              >
                Checkout
              </Button>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
export default CartPage;