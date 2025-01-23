import axios from "axios";
import axiosInstance from "./axios";


const Product_Top_Rated = async (limit = 3) => {
    try {
        const response = await axiosInstance.get(`/api/v1/product/top-rated`,{ noAuth: true }, {
            params: { limit }, 
        });
        return response.data; 
    } catch (error) {
        console.error('Error fetching top-rated products:', error);
        throw error;
    }
};

const Product_Category = async () => {
    try {
        const response = await axiosInstance.get('/api/v1/admin/settings/2',{ noAuth: true });
        return response.data; 
    } catch (error) {
        console.error('Error fetching product category:', error);
        throw error; 
    }
};
const Product_Trending = async (settingId = 0, limit = 10) => {
    try {
        const url = `/api/v1/product/trending?settingId=${settingId}&limit=${limit}`; // Correct URL format

        const response = await axiosInstance.get(url, { noAuth: true });
        return response.data;
    } catch (error) {
        console.error('Error fetching trending products:', error);
        throw error;
    }
};










const Product_Services = {
    Product_Top_Rated,
    Product_Category,
    Product_Trending,

}
export default Product_Services;