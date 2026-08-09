import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, getOrderById, cancelOrder, reorder } from '../services/OrderServices';
import { message } from 'antd';
export const useOrders = (page: number, limit: number, status?: string, search?: string) => {
  return useQuery({
    queryKey: ['orders', page, limit, status, search],
    queryFn: () => getOrders(page, limit, status, search),
    placeholderData: (previousData) => previousData, // keep previous data while fetching
  });
};
export const useOrder = (id: string | null) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => id ? getOrderById(id) : Promise.reject('No ID'),
    enabled: !!id,  
  });
};
export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      message.success('Order cancelled successfully');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: () => {
      message.error('Failed to cancel order');
    }
  });
};
export const useReorder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reorder,
    onSuccess: () => {
      message.success('Items added to cart for reorder');
    },
    onError: () => {
      message.error('Failed to reorder items');
    }
  });
};

