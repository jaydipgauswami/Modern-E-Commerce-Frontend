import React from 'react';
import { Card, Typography, Tag, Button, Space, Divider, Avatar } from 'antd';
import { Order } from '../../app/Types/order';
import dayjs from 'dayjs';
const { Text, Title } = Typography;
interface OrderCardProps {
  order: Order;
  onViewDetails: (id: string) => void;
  onCancelOrder?: (id: string) => void;
  onReorder?: (id: string) => void;
}
const statusColors: Record<string, string> = {
  Pending: 'orange',
  Processing: 'blue',
  Shipped: 'geekblue',
  Delivered: 'success',
  Cancelled: 'error',
  Returned: 'warning',
};
const paymentColors: Record<string, string> = {
  Paid: 'success',
  Unpaid: 'warning',
  Refunded: 'default',
  Failed: 'error',
};
export const OrderCard: React.FC<OrderCardProps> = ({ order, onViewDetails, onCancelOrder, onReorder }) => {
  const firstItem = order.items[0];
  const extraItemsCount = order.items.length - 1;
  return (
    <Card 
      style={{ marginBottom: 16 }} 
      bodyStyle={{ padding: 0 }}
      hoverable
    >
      <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              <Avatar.Group shape="square" size={64}>
                {order.items.slice(0, 2).map((item, idx) => (
                  <Avatar key={idx} src={item.image} shape="square" size={64} style={{ backgroundColor: '#f0f0f0' }} />
                ))}
              </Avatar.Group>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Space>
                <Title level={5} style={{ margin: 0 }}>{order.orderId}</Title>
                <Text type="secondary">• {dayjs(order.date).format('MMM DD, YYYY, HH:mm')}</Text>
              </Space>
              <Text type="secondary" style={{ marginTop: 4 }}>
                {order.items.length} item{order.items.length > 1 ? 's' : ''}: {firstItem.name} 
                {extraItemsCount > 0 && `, and ${extraItemsCount} more`}
              </Text>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: 8 }}>
            <Title level={4} style={{ margin: 0 }}>${order.summary.grandTotal.toFixed(2)}</Title>
            <Space>
              <Tag color={paymentColors[order.paymentStatus]}>{order.paymentStatus}</Tag>
              <Tag color={statusColors[order.status]}>{order.status}</Tag>
            </Space>
          </div>
        </div>
      </div>
      
      <Divider style={{ margin: 0 }} />
      
      <div style={{ padding: '12px 24px', display: 'flex', justifyContent: 'flex-end', gap: 8, backgroundColor: '#fafafa', borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
        {order.status === 'Pending' && onCancelOrder && (
          <Button onClick={() => onCancelOrder(order.id)}>Cancel Order</Button>
        )}
        {(order.status === 'Delivered' || order.status === 'Cancelled' || order.status === 'Returned') && onReorder && (
          <Button onClick={() => onReorder(order.id)}>Reorder</Button>
        )}
        <Button type="primary" onClick={() => onViewDetails(order.id)}>View Details</Button>
      </div>
    </Card>
  );
};
