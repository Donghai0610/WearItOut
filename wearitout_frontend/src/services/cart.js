import axiosInstance from "./axios";


// Lấy thông tin giỏ hàng theo userId
const Get_Cart = async (userId) => {
    try {
        if (!userId) {
            throw new Error("User ID is required");
        }
        const response = await axiosInstance.get(`/api/v1/cart/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cart:', error);
        throw error;
    }
};

// Đếm số lượng sản phẩm trong giỏ hàng
const Count_Products_In_Cart = async (cartId) => {
    try {
        if (!cartId) {
            throw new Error("Cart ID is required");
        }
        const response = await axiosInstance.get(`/api/v1/cart/${cartId}/count-products`);
        return response.data;
    } catch (error) {
        console.error('Error counting products in cart:', error);
        throw error;
    }
};

// Thêm sản phẩm vào giỏ hàng
const Add_Product_To_Cart = async (userId, payload) => {
    try {
        if (!userId || !payload) {
            throw new Error("User ID and payload are required");
        }
        const response = await axiosInstance.post(`/api/v1/cart/${userId}/add`, payload);
        return response.data;
    } catch (error) {
        console.error('Error adding product to cart:', error);
        throw error;
    }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
const Update_Product_In_Cart = async (userId, payload) => {
    try {
        if (!userId || !payload) {
            throw new Error("User ID and payload are required");
        }
        const response = await axiosInstance.post(`/api/v1/cart/${userId}/update`, payload);
        return response.data;
    } catch (error) {
        console.error('Error updating product in cart:', error);
        throw error;
    }
};

// Xóa sản phẩm khỏi giỏ hàng
const Remove_Product_From_Cart = async (userId, productId) => {
    try {
        if (!userId || !productId) {
            throw new Error("User ID and Product ID are required");
        }
        const response = await axiosInstance.post(`/api/v1/cart/${userId}/remove/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing product from cart:', error);
        throw error;
    }
};

const Cart_Services = {
    Get_Cart,
    Count_Products_In_Cart,
    Add_Product_To_Cart,
    Update_Product_In_Cart,
    Remove_Product_From_Cart,
}
export default Cart_Services;