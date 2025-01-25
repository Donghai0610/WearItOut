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

const Product_Category = async (number) => {
    try {
        const response = await axiosInstance.get(`/api/v1/admin/settings/${number}`,{ noAuth: true });
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

const Product_Details = async (id) => {
    try {
        if (!id) {
            throw new Error("Product ID is required");
        }
        const response = await axiosInstance.get(`/api/v1/product/${id}`, { noAuth: true });
        return response.data;
    } catch (error) {
        console.error('Error fetching product details:', error);
        throw error;
    }
};

const Same_Product = async (id) => {
    try {
        if (!id) {
            throw new Error("Product ID is required");
        }
        const response = await axiosInstance.get(`/api/v1/product/same-product/${id}`, { noAuth: true });
        return response.data;
    } catch (error) {
        console.error('Error fetching product details:', error);
        throw error;
    }
};


const Product_Search=  async ({
    productName = '',
    priceMin = null,
    priceMax = null,
    ratingMin = null,
    ratingMax = null,
    setting = '',
    shop = '',
    page = 0,
    size = 9,
    sortDirection = 'asc',
}) => {
    try {
        // Tạo query parameters
        const params = {
            productName,
            priceMin,
            priceMax,
            ratingMin,
            ratingMax,
            setting,
            shop,
            page,
            size,
            sortDirection,
        };

        // Gọi API với axiosInstance
        const response = await axiosInstance.get('/api/v1/products/search', { params });
        return response.data;
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};











const Product_Services = {
    Product_Top_Rated,
    Product_Category,
    Product_Trending,
    Product_Details,
    Same_Product,
    Product_Search,

}
export default Product_Services;