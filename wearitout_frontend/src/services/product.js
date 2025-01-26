import axios from "axios";
import axiosInstance from "./axios";


const Product_Top_Rated = async (limit = 3) => {
    try {
        const response = await axiosInstance.get(`/api/v1/product/top-rated`, { noAuth: true }, {
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
        const response = await axiosInstance.get(`/api/v1/admin/settings/${number}`, { noAuth: true });
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
const Product_Search = async (filters) => {
    const {
        productName,
        priceMin,
        priceMax,
        ratingMin,
        ratingMax,
        setting,
        shop,
        page = 0,
        size = 9,
        sortDirection = 'asc'
    } = filters;

    const params = { page, size, sortDirection };

    // Thêm các tham số vào params nếu có giá trị
    if (productName) {
        params.productName = productName;
    }
    if (priceMin !== undefined) {
        params.priceMin = priceMin;
    }
    if (priceMax !== undefined) {
        params.priceMax = priceMax;
    }
    if (ratingMin !== undefined) {
        params.ratingMin = ratingMin;
    }
    if (ratingMax !== undefined) {
        params.ratingMax = ratingMax;
    }
    if (setting) {
        params.setting = setting;
    }
    if (shop) {
        params.shop = shop;
    }

    try {
        const response = await axiosInstance.get('/api/v1/product/search', { params });
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error('Error fetching products:', error);
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