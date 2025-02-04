import { jwtDecode } from "jwt-decode";
import axiosInstance from "./axios";

 const login = async (username, password) => {
    const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
        return data;
    } else {
        throw new Error(data.message || 'Login failed');
    }
};

const register = async (username, password, email, phone) => {
    try {
        const response = await axiosInstance.post(
            '/api/v1/user/register', 
            {
                username,
                password,
                email,
                phone,
            },
            {
                noAuth: true, // Đặt `noAuth` trong config
            }
        );
        console.log('Registration successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during registration:', error.response?.data || error.message);
        throw error;
    }
};

  const getUserIdFromToken = () => {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage
        if (!token) return null;
        const decoded = jwtDecode(token);
        return decoded.userId;
    };

    const getUserDetail = async () => {
        const userId = getUserIdFromToken(); // Lấy userId từ token
        if (!userId) {
            throw new Error('User is not authenticated');
        }
    
        try {
            // Gọi API GET để lấy thông tin người dùng
            const response = await axiosInstance.get(`/api/v1/user/${userId}`);
            console.log('User details:', response.data);
    
            // Kiểm tra các trường cần thiết trong response
            const userData = response.data;
    
            // Kiểm tra nếu một số trường quan trọng thiếu (null), yêu cầu người dùng nhập lại
            if (!userData.firstName || !userData.lastName || !userData.address) {
                return { needToFillForm: true, userDetails: userData }; // Cần nhập thêm thông tin
            }
    
            return { needToFillForm: false, userDetails: userData }; // Không cần nhập thêm thông tin
        } catch (error) {
            console.error('Error fetching user details:', error.response?.data || error.message);
            throw error;
        }
    };
    
   
 const  Account_Service ={
    login,
    register,
    getUserIdFromToken,
    getUserDetail,


};
export default Account_Service;