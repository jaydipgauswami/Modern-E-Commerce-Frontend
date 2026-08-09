export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned' | 'Refunded';
export type PaymentStatus = 'Paid' | 'Unpaid' | 'Refunded' | 'Failed';
export interface ProductVariant {
  size?: string;
  color?: string;
}
export interface OrderItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
  image: string;
  variant?: ProductVariant;
}
export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}
export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
export interface OrderSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  grandTotal: number;
}
export interface TimelineEvent {
  status: OrderStatus;
  date: string;
  description: string;
}
export interface Order {
  id: string;
  orderId: string;
  date: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  customer: CustomerInfo;
  shippingAddress: Address;
  billingAddress: Address;
  summary: OrderSummary;
  timeline: TimelineEvent[];
}
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface OrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
    pagination: Pagination;
  };
}
export interface OrderResponse {
  success: boolean;
  data: Order;
}
