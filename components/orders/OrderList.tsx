import React, { useState } from 'react';
import { Select, Button, Space, Pagination, Input, Drawer } from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { useOrders, useCancelOrder, useReorder } from '../../app/Hooks/useOrder';
import { OrderCard } from './OrderCard';
import { OrderSkeleton } from './OrderSkeleton';
import { EmptyState } from './EptyState';
import { OrderDetailsDrawer } from './OrderDetailDwawwer';
import { useRouter, useSearchParams } from 'next/navigation';
const { Option } = Select;
interface OrderListProps {
  currentStatus: string;
  isMobile?: boolean;
}
export const OrderList: React.FC<OrderListProps> = ({ currentStatus, isMobile }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const [drawerOrderId, setDrawerOrderId] = useState<string | null>(null);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  
  // Local search state to debounce/handle enter key
  const [searchValue, setSearchValue] = useState(search);
  const { data: response, isLoading, isError } = useOrders(page, limit, currentStatus, search);
  const cancelOrderMutation = useCancelOrder();
  const reorderMutation = useReorder();
  const handlePageChange = (newPage: number, newLimit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    params.set('limit', newLimit.toString());
    router.push(`?${params.toString()}`);
  };
  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('search', value);
      params.set('page', '1');
    } else {
      params.delete('search');
    }
    router.push(`?${params.toString()}`);
  };
  const orders = response?.data.orders || [];
  const pagination = response?.data.pagination;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Top Actions Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <Title level={isMobile ? 4 : 2} style={{ margin: 0 }}>Order History</Title>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Input 
            placeholder="Search orders..." 
            prefix={<SearchOutlined />} 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onPressEnter={(e) => handleSearch(searchValue)}
            style={{ width: isMobile ? '100%' : 200 }}
          />
          <Select defaultValue="Last 30 Days" style={{ width: 140 }}>
            <Option value="Today">Today</Option>
            <Option value="Last 7 Days">Last 7 Days</Option>
            <Option value="Last 30 Days">Last 30 Days</Option>
            <Option value="Last 90 Days">Last 90 Days</Option>
            <Option value="Custom Range">Custom Range</Option>
          </Select>
          <Select defaultValue="Latest First" style={{ width: 140 }}>
            <Option value="Latest First">Latest First</Option>
            <Option value="Oldest First">Oldest First</Option>
            <Option value="Highest Amount">Highest Amount</Option>
            <Option value="Lowest Amount">Lowest Amount</Option>
          </Select>
          <Button icon={<FilterOutlined />} onClick={() => setIsAdvancedFilterOpen(true)}>
            Filter
          </Button>
        </div>
      </div>
      {/* Orders List */}
      <div>
        {isLoading ? (
          <OrderSkeleton />
        ) : isError ? (
          <div style={{ padding: 48, textAlign: 'center', backgroundColor: '#fff', borderRadius: 8 }}>
            <h3>Something went wrong.</h3>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : orders.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {orders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={(id) => setDrawerOrderId(id)}
                onCancelOrder={(id) => cancelOrderMutation.mutate(id)}
                onReorder={(id) => reorderMutation.mutate(id)}
              />
            ))}
            
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, marginBottom: 24 }}>
              <Pagination
                current={pagination?.page || 1}
                pageSize={pagination?.limit || 10}
                total={pagination?.total || 0}
                onChange={handlePageChange}
                showSizeChanger
                showTotal={(total) => `Total ${total} orders`}
              />
            </div>
          </>
        )}
      </div>
      <OrderDetailsDrawer 
        open={!!drawerOrderId} 
        orderId={drawerOrderId} 
        onClose={() => setDrawerOrderId(null)} 
      />
      <Drawer
        title="Advanced Filters"
        placement="right"
        onClose={() => setIsAdvancedFilterOpen(false)}
        open={isAdvancedFilterOpen}
      >
        <p>Advanced filtering options will go here (Payment Status, Amount Range, etc.)</p>
      </Drawer>
    </div>
  );
};
// Fix for Title component which wasn't imported from antd properly
import { Typography } from 'antd';
const { Title } = Typography;

