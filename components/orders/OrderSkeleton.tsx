import React from 'react';
import { Skeleton, Card } from 'antd';
export const OrderSkeleton: React.FC = () => {
  return (
   <>
  {[1, 2, 3].map((item) => (
    <Card
      key={item}
      style={{ marginBottom: 16 }}
      bodyStyle={{ padding: 24 }}
    >
      <Skeleton
        avatar={{ shape: "square", size: 64 }}
        paragraph={{ rows: 2 }}
        active
      />
    </Card>
  ))}
</>
  );
};

