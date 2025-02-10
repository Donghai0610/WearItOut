import axiosInstance from './axios';


// 1. Thanh toán qua VNPay
const payWithVNPay = async (amount, orderId) => {
    try {
        const response = await axiosInstance.post('/payment/vnpay', { amount, orderId });
        if (response.data.success) {
            window.location.href = response.data.url; // Chuyển hướng đến trang thanh toán VNPay
        }
    } catch (error) {
        console.error('Lỗi khi thanh toán qua VNPay:', error);
    }
};

// 2. Thanh toán bằng mã QR
const payWithQR = async (amount, orderId) => {
    try {
        const response = await axiosInstance.post('/payment/qr', { amount, orderId });
        if (response.data.success) {
            alert('Quét mã QR để thanh toán!');
            console.log('Mã QR:', response.data.qrCode); // Hiển thị mã QR (hoặc render ảnh)
        }
    } catch (error) {
        console.error('Lỗi khi thanh toán bằng mã QR:', error);
    }
};

// 3. Thanh toán khi nhận hàng (COD)
const payWithCOD = async (orderId, userId) => {
    try {
        const response = await axiosInstance.post('/payment/cod', { orderId, userId });
        if (response.data.success) {
            alert('Đơn hàng đã được tạo, thanh toán khi nhận hàng.');
        }
    } catch (error) {
        console.error('Lỗi khi đặt hàng COD:', error);
    }
};

const Payment_Services = {
    payWithVNPay,
    payWithQR,
    payWithCOD,
}

export default Payment_Services;