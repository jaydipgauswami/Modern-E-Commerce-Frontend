import React from 'react';
import { Typography, Divider } from 'antd';
import { OrderSummary as OrderSummaryType } from '../../app/Types/order';
const { Text, Title } = Typography;
interface OrderSummaryProps {
  summary: OrderSummaryType;
}
export const OrderSummary: React.FC<OrderSummaryProps> = ({ summary }) => {
  return (
    <div style={{ backgroundColor: '#fafafa', padding: 24, borderRadius: 8 }}>
      <Title level={5} style={{ marginTop: 0, marginBottom: 16 }}>Order Summary</Title>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text type="secondary">Subtotal</Text>
        <Text>${summary.subtotal.toFixed(2)}</Text>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text type="secondary">Tax</Text>
        <Text>${summary.tax.toFixed(2)}</Text>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text type="secondary">Shipping</Text>
        <Text>${summary.shipping.toFixed(2)}</Text>
      </div>
      
      {summary.discount > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text type="secondary">Discount</Text>
          <Text type="danger">-${summary.discount.toFixed(2)}</Text>
        </div>
      )}
      
      <Divider style={{ margin: '12px 0' }} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Text strong style={{ fontSize: 16 }}>Grand Total</Text>
        <Text strong style={{ fontSize: 16 }}>${summary.grandTotal.toFixed(2)}</Text>
      </div>
    </div>
  );
};

