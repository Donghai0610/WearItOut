import axiosInstance from "./axios";

const getTotalItemsInCart = async (cartId) => {
    try {
        const response = await axiosInstance.get(`/api/v1/cart_item/total-items/${cartId}`)
        return response.data.totalItems;
    } catch (error) {
        console.error('Error fetching API: ', error);
        throw error;
    }


}; 


const Cart_Items_Services = {
    getTotalItemsInCart,
}

export default Cart_Items_Services;