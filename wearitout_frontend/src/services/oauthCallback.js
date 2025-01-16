import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy token và role từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const role = urlParams.get('role');

    if (token && role) {
      // Lưu token và role vào localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      Swal.fire('Login Success', 'Logged in with Google successfully!', 'success');

      // Điều hướng người dùng dựa trên role
      if (role === 'ADMIN') {
        navigate('/');
      } else if (role === 'USER') {
        navigate('/');
      } else if (role === 'SELLER' || role === 'SHOPSTAFF') {
        navigate('/');
      }
    } else {
      // Trường hợp không có token hoặc role, báo lỗi
      Swal.fire('Login Failed', 'Invalid token or role received.', 'error');
      navigate('/login'); // Quay về trang đăng nhập
    }
  }, [navigate]);

  return <div>Processing...</div>;
};

export default OAuthCallback;
