'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { Layout, Input, Badge, Avatar, Button, Drawer } from 'antd';
import { BellOutlined, SettingOutlined, MenuOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { OrderFilters } from '../../../components/orders/OrderFilter';
import { OrderList } from '../../../components/orders/OrderList';
import { useRouter, useSearchParams } from 'next/navigation';
const { Header, Sider, Content } = Layout;
function OrdersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get('status') || 'All Orders';
  
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('status', status);
    params.set('page', '1'); // reset page
    router.push(`?${params.toString()}`);
    if (isMobile) {
      setDrawerVisible(false);
    }
  };
  const headerContent = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {isMobile && (
          <Button type="text" icon={<MenuOutlined />} onClick={() => setDrawerVisible(true)} />
        )}
        <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1677ff', display: isMobile ? 'none' : 'block' }}>
          OrderManager
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Input 
          placeholder="Search orders..." 
          prefix={<SearchOutlined />} 
          style={{ width: isMobile ? 150 : 250, borderRadius: 20 }}
          onPressEnter={(e) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set('search', (e.target as HTMLInputElement).value);
            router.push(`?${params.toString()}`);
          }}
        />
        <Badge count={3}>
          <Button type="text" icon={<BellOutlined style={{ fontSize: 18 }} />} />
        </Badge>
        <Button type="text" icon={<SettingOutlined style={{ fontSize: 18 }} />} />
        <Button type="primary" icon={<PlusOutlined />} style={{ borderRadius: 20 }}>
          {isMobile ? '' : 'Create Order'}
        </Button>
        <Avatar style={{ backgroundColor: '#87d068' }}>US</Avatar>
      </div>
    </div>
  );
  const filterContent = (
    <OrderFilters 
      currentStatus={currentStatus} 
      onStatusChange={handleStatusChange} 
      isMobile={isMobile}
    />
  );
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px', position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid #f0f0f0' }}>
        {headerContent}
      </Header>
      
      <Layout>
        {!isMobile && (
          <Sider width={250} style={{ background: '#f9fbfc', padding: '24px 0', borderRight: '1px solid #f0f0f0' }}>
            {filterContent}
          </Sider>
        )}
        <Content style={{ padding: isMobile ? 16 : 24, background: '#f9fbfc' }}>
          <OrderList currentStatus={currentStatus} isMobile={isMobile} />
        </Content>
      </Layout>
      <Drawer
        title="Order Filters"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        bodyStyle={{ padding: 0 }}
      >
        {filterContent}
      </Drawer>
    </Layout>
  );
}
export default function OrdersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrdersPageContent />
    </Suspense>
  );
}