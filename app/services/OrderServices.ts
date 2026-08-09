import { OrdersResponse, OrderResponse } from '../../app/Types/order';
const API_BASE = '/api/orders';
export const getOrders = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
  search?: string
): Promise<OrdersResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (status && status !== 'All Orders') params.append('status', status);
  if (search) params.append('search', search);
  const response = await fetch(`${API_BASE}?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  return response.json();
};
export const getOrderById = async (id: string): Promise<OrderResponse> => {
  // In a real app, this would hit ${API_BASE}/${id}
  // For now we will just use the list endpoint and find the first
  const response = await fetch(`${API_BASE}`);
  const data: OrdersResponse = await response.json();
  const order = data.data.orders.find(o => o.id === id || o.orderId === id);
  if (!order) {
    throw new Error('Order not found');
  }
  return { success: true, data: order };
};
export const createOrder = async (data: any): Promise<any> => {
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000));
};
export const updateOrder = async (id: string, data: any): Promise<any> => {
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000));
};
export const cancelOrder = async (id: string): Promise<any> => {
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000));
};
export const trackOrder = async (id: string): Promise<any> => {
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000));
};
export const downloadInvoice = async (id: string): Promise<any> => {
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000));
};
export const reorder = async (id: string): Promise<any> => {
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000));
};

