import axiosInstance from "./axios";




const getPurchasedProductsByUser = async (userId) => {
    try {
        // Gửi request tới API để lấy danh sách các sản phẩm đã mua của người dùng
        const response = await axiosInstance.get(`/api/v1/user/order/${userId}/purchased-products`);

        // Trả về dữ liệu nếu thành công
        if (response.data) {
            return response.data;  // Đây là danh sách các sản phẩm đã mua
        } else {
            throw new Error("Không tìm thấy dữ liệu sản phẩm");
        }
    } catch (error) {
        // Xử lý lỗi nếu có (ví dụ: lỗi kết nối hoặc API trả về lỗi)
        console.error("Lỗi khi lấy dữ liệu sản phẩm đã mua:", error);
        throw error; // Có thể ném lỗi để xử lý ở nơi gọi method này
    }
};

const createOrderAndPayment = async (userId, shipAddress, paymentMethod) => {
    try {
        const response = await axiosInstance.post(`/api/v1/user/order/create-payment`, null, {
            params: {
                userId: userId,
                shipAddress: shipAddress,
                paymentMethod: paymentMethod,
            }
        });

        console.log("Đơn hàng và thanh toán thành công:", response.data);
        return response.data;  // Trả về dữ liệu của đơn hàng mới tạo
    } catch (error) {
        console.error("Lỗi khi tạo đơn hàng và thanh toán:", error);
        throw error;  // Ném lỗi để xử lý ở nơi gọi
    }
};
const handlePaymentSuccess = async (orderId) => {
    try {
        const response = await axiosInstance.post(`/api/v1/user/order/payment-success`, null, {
            params: {
                orderId: orderId,
            }
        });

        console.log("Trạng thái thanh toán đã được cập nhật:", response.data);
        return response.data;  // Trả về thông tin thành công
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái thanh toán:", error);
        throw error;  // Ném lỗi để xử lý ở nơi gọi
    }
};
const handlePaymentCancel = async (orderId) => {
    try {
        const response = await axiosInstance.post(`/api/v1/user/order/cancel-payment/${orderId}`);

        console.log("Trạng thái thanh toán đã được cập nhật:", response.data);
        return response.data;  // Trả về thông tin thành công
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái thanh toán:", error);
        throw error;  // Ném lỗi để xử lý ở nơi gọi
    }
};

const Order_Service = {
    getPurchasedProductsByUser,
    createOrderAndPayment,
    handlePaymentSuccess,
    handlePaymentCancel

};

export default Order_Service;
