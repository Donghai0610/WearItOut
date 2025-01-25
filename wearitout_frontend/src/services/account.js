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
   
 const  Account_Service ={
    login,
    register,
    getUserIdFromToken

};
export default Account_Service;