import axiosInstance from "./axios";

const createOrder = async (order) => {
    try {
        // Gửi yêu cầu tạo đơn hàng tới API backend bằng query parameters
        const response = await axiosInstance.post(`api/v1/user/order/create`, null, {
            params: {
                userId: order.userId,
                shipAddress: order.shipAddress,
                paymentMethod: order.paymentMethod
            }
        });

        // Lấy thông tin đơn hàng từ phản hồi
        const createdOrder = response.data;
        
        // Nếu cần, cập nhật danh sách đơn hàng trong state hoặc thực hiện xử lý khác
        console.log('Đơn hàng được tạo thành công:', createdOrder);

        // Trả về đơn hàng mới được tạo
        return createdOrder;
    } catch (error) {
        console.error('Lỗi khi tạo đơn hàng:', error);
        throw error;
    }
};


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


const Order_Service = {
    createOrder,
    getPurchasedProductsByUser
};

export default Order_Service;
