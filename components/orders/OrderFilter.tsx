import React from 'react';
import { Menu, Typography } from 'antd';
import { 
  AppstoreOutlined, 
  ClockCircleOutlined, 
  SyncOutlined, 
  CarOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined 
} from '@ant-design/icons';
const { Title, Text } = Typography;
interface OrderFiltersProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
  isMobile?: boolean;
}
const statusOptions = [
  { key: 'All Orders', label: 'All Orders', icon: <AppstoreOutlined />, count: 120 },
  { key: 'Pending', label: 'Pending', icon: <ClockCircleOutlined />, count: 12 },
  { key: 'Processing', label: 'Processing', icon: <SyncOutlined />, count: 5 },
  { key: 'Shipped', label: 'Shipped', icon: <CarOutlined />, count: 24 },
  { key: 'Delivered', label: 'Delivered', icon: <CheckCircleOutlined />, count: 54 },
  { key: 'Cancelled', label: 'Cancelled', icon: <CloseCircleOutlined />, count: 15 },
];
export const OrderFilters: React.FC<OrderFiltersProps> = ({ currentStatus, onStatusChange, isMobile }) => {
  return (
    <div style={{ padding: isMobile ? 0 : '0 16px' }}>
      {!isMobile && (
        <div style={{ marginBottom: 24, paddingLeft: 16 }}>
          <Title level={4} style={{ margin: 0 }}>Order Filters</Title>
          <Text type="secondary">Manage your sales</Text>
        </div>
      )}
      <Menu
        mode="inline"
        selectedKeys={[currentStatus]}
        onClick={(e) => onStatusChange(e.key)}
        style={{ borderRight: 0, backgroundColor: 'transparent' }}
        items={statusOptions.map(option => ({
          key: option.key,
          icon: option.icon,
          label: (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{option.label}</span>
            </div>
          ),
        }))}
      />
    </div>
  );
};

