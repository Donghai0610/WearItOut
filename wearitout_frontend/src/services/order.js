import { useState, useEffect } from 'react';
import axiosInstance from './axios';

const useOrderServices = () => {
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});
  const [orderServices, setOrderServices] = useState([]);
  const [shippingStatus, setShippingStatus] = useState({});
  const [error, setError] = useState(null);

  // Get orders by shop
  const getOrdersByShop = async ({ shopId, search = '', paymentStatus = '', shippingStatus = '', page = 0, size = 10 }) => {
    try {
      const params = {
        shopId,
        ...(search && { search }),
        ...(paymentStatus && { paymentStatus }),
        ...(shippingStatus && { shippingStatus }),
        page,
        size,
      };
      const queryParams = new URLSearchParams(Object.entries(params).filter(([v]) => v !== ''));
      const { data } = await axiosInstance.get(`api/v1/shop_staff/order/list?${queryParams.toString()}`);
      setOrders(data.content);
    } catch (error) {
      setError(error);
      console.log(error);
    }
  };

  // Get order details by orderId
  const getOrderDetailByOrderId = async (orderId) => {
    try {
      const { data } = await axiosInstance.get(`api/v1/user/order/${orderId}/details`);
      setOrderDetails(data);
    } catch (error) {
      setError(error);
      console.log(error);
    }
  };

  // Get order services for shipping
  const getOrderServices = async (orderId) => {
    try {
      const { data } = await axiosInstance.get(`/api/v1/shop_staff/order/${orderId}/services`);
      setOrderServices(data);
    } catch (error) {
      setError(error);
      console.log(error);
    }
  };

  // Cancel order by orderId
  const cancelOrder = async (orderId) => {
    try {
      await axiosInstance.get(`api/v1/user/order/${orderId}/cancel`);
      // Optionally, you can update the local state to reflect the cancellation
    } catch (error) {
      setError(error);
      console.log(error);
    }
  };

  // Get order shipping status
  const getOrderShippingStatus = async (orderId) => {
    try {
      const { data } = await axiosInstance.get(`api/v1/user/order/${orderId}/shipping-status`);
      setShippingStatus(data);
    } catch (error) {
      setError(error);
      console.log(error);
    }
  };

  // Send order shipping request to GHN
  const sendOrderShippingRequestToGHN = async ({ orderId, serviceId, serviceTypeId, paymentTypeId, note }) => {
    try {
      const { data } = await axiosInstance.get(`/api/v1/shop_staff/order/${orderId}/create_order?serviceId=${serviceId}&serviceTypeId=${serviceTypeId}&paymentTypeId=${paymentTypeId}&note=${encodeURIComponent(note)}`);
      // Handle response (e.g., show success message or update order status)
    } catch (error) {
      setError(error);
      console.log(error);
    }
  };

 


  return {
    orders,
    orderDetails,
    orderServices,
    shippingStatus,
    getOrdersByShop,
    getOrderDetailByOrderId,
    getOrderServices,
    cancelOrder,
    getOrderShippingStatus,
    sendOrderShippingRequestToGHN,
    error,
  };
};

export default useOrderServices;
