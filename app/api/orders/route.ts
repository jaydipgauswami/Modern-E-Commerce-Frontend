import { NextRequest, NextResponse } from 'next/server';
import { Order, OrderStatus } from '@/types/order';
const mockOrders: Order[] = Array.from({ length: 45 }).map((_, i) => ({
  id: `ORD-829${31 - i}`,
  orderId: `#ORD-829${31 - i}`,
  date: new Date(Date.now() - i * 86400000).toISOString(),
  status: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'][i % 6] as OrderStatus,
  paymentStatus: ['Paid', 'Unpaid', 'Refunded', 'Failed'][i % 4] as any,
  items: [
    {
      id: `ITEM-${i}-1`,
      name: i % 2 === 0 ? 'Nike Air Max' : 'Sony WH-1000XM4 Headphones',
      sku: `SKU-${i}-1`,
      price: i % 2 === 0 ? 150 : 299,
      quantity: 1,
      total: i % 2 === 0 ? 150 : 299,
      image: 'https://via.placeholder.com/60',
      variant: { size: '9' }
    },
    ...(i % 3 === 0 ? [{
      id: `ITEM-${i}-2`,
      name: 'Apple Watch SE',
      sku: `SKU-${i}-2`,
      price: 199,
      quantity: 1,
      total: 199,
      image: 'https://via.placeholder.com/60',
    }] : [])
  ],
  customer: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900'
  },
  shippingAddress: {
    line1: '123 Main St',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'USA'
  },
  billingAddress: {
    line1: '123 Main St',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'USA'
  },
  summary: {
    subtotal: 349,
    tax: 30,
    shipping: 10,
    discount: 0,
    grandTotal: 389
  },
  timeline: [
    {
      status: 'Pending',
      date: new Date(Date.now() - i * 86400000).toISOString(),
      description: 'Order placed successfully'
    }
  ]
}));
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  let filteredOrders = mockOrders;
  if (status && status !== 'All Orders') {
    filteredOrders = filteredOrders.filter(o => o.status === status);
  }
  if (search) {
    filteredOrders = filteredOrders.filter(o => 
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some(item => item.name.toLowerCase().includes(search.toLowerCase()))
    );
  }
  const total = filteredOrders.length;
  const totalPages = Math.ceil(total / limit);
  
  const start = (page - 1) * limit;
  const paginatedOrders = filteredOrders.slice(start, start + limit);
  return NextResponse.json({
    success: true,
    data: {
      orders: paginatedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    }
  });
}