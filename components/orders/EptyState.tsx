import React from 'react';
import { Empty, Button } from 'antd';
export const EmptyState: React.FC = () => {
  return (
    <div style={{ padding: '48px 0', backgroundColor: '#fff', borderRadius: 8, marginTop: 16 }}>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div>
            <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>No Orders Found</div>
            <div style={{ color: '#8c8c8c' }}>Start shopping to create your first order.</div>
          </div>
        }
      >
        <Button type="primary">Browse Products</Button>
      </Empty>
    </div>
  );
};