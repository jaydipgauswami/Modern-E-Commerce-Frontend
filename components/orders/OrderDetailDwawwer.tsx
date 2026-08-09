import React from 'react';
import { Drawer, Row, Col, Typography, Tag, Table, Divider } from 'antd';
import { useOrder } from '../../app/Hooks/useOrder';
import { OrderSummary } from './OrderSummry';
import { OrderTimeline } from './OrderRTimeline';
import dayjs from 'dayjs';
const { Title, Text } = Typography;
interface OrderDetailsDrawerProps {
  orderId: string | null;
  open: boolean;
  onClose: () => void;
}
const paymentColors: Record<string, string> = {
  Paid: 'success',
  Unpaid: 'warning',
  Refunded: 'default',
  Failed: 'error',
};
const statusColors: Record<string, string> = {
  Pending: 'orange',
  Processing: 'blue',
  Shipped: 'geekblue',
  Delivered: 'success',
  Cancelled: 'error',
  Returned: 'warning',
};
export const OrderDetailsDrawer: React.FC<OrderDetailsDrawerProps> = ({ orderId, open, onClose }) => {
  const { data: response, isLoading } = useOrder(orderId);
  const order = response?.data;
  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={record.image} alt={text} style={{ width: 40, height: 40, borderRadius: 4, backgroundColor: '#f0f0f0' }} />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>SKU: {record.sku}</Text>
          </div>
        </div>
      )
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (val: number) => `$${val.toFixed(2)}`
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (val: number) => `$${val.toFixed(2)}`
    }
  ];
  return (
    <Drawer
      title={order ? `Order Details - ${order.orderId}` : 'Order Details'}
      width={720}
      onClose={onClose}
      open={open}
      loading={isLoading}
      styles={{ body: { paddingBottom: 80 } }}
    >
      {order && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Order Info */}
          <Row gutter={16}>
            <Col span={12}>
              <Title level={5} style={{ marginTop: 0 }}>Order Information</Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Text><Text type="secondary">Order ID:</Text> {order.orderId}</Text>
                <Text><Text type="secondary">Date:</Text> {dayjs(order.date).format('MMM DD, YYYY, HH:mm A')}</Text>
                <Text>
                  <Text type="secondary">Status:</Text> <Tag color={statusColors[order.status]}>{order.status}</Tag>
                </Text>
                <Text>
                  <Text type="secondary">Payment:</Text> <Tag color={paymentColors[order.paymentStatus]}>{order.paymentStatus}</Tag>
                </Text>
              </div>
            </Col>
            <Col span={12}>
              <Title level={5} style={{ marginTop: 0 }}>Customer Information</Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Text><Text type="secondary">Name:</Text> {order.customer.name}</Text>
                <Text><Text type="secondary">Email:</Text> {order.customer.email}</Text>
                <Text><Text type="secondary">Phone:</Text> {order.customer.phone}</Text>
              </div>
            </Col>
          </Row>
          <Divider style={{ margin: 0 }} />
          {/* Addresses */}
          <Row gutter={16}>
            <Col span={12}>
              <Title level={5} style={{ marginTop: 0 }}>Shipping Address</Title>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Text>{order.shippingAddress.line1}</Text>
                {order.shippingAddress.line2 && <Text>{order.shippingAddress.line2}</Text>}
                <Text>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</Text>
                <Text>{order.shippingAddress.country}</Text>
              </div>
            </Col>
            <Col span={12}>
              <Title level={5} style={{ marginTop: 0 }}>Billing Address</Title>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Text>{order.billingAddress.line1}</Text>
                {order.billingAddress.line2 && <Text>{order.billingAddress.line2}</Text>}
                <Text>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}</Text>
                <Text>{order.billingAddress.country}</Text>
              </div>
            </Col>
          </Row>
          <Divider style={{ margin: 0 }} />
          {/* Products */}
          <div>
            <Title level={5} style={{ marginTop: 0, marginBottom: 16 }}>Ordered Products</Title>
            <Table 
              columns={columns} 
              dataSource={order.items} 
              rowKey="id" 
              pagination={false}
              size="small"
            />
          </div>
          <Row gutter={24}>
            <Col span={14}>
              <Title level={5} style={{ marginTop: 0 }}>Order Timeline</Title>
              <OrderTimeline events={order.timeline} />
            </Col>
            <Col span={10}>
              <OrderSummary summary={order.summary} />
            </Col>
          </Row>
        </div>
      )}
    </Drawer>
  );
};

