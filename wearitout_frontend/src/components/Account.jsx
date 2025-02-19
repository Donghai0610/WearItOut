import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Account_Service, { loginHandle, register } from '../services/account.js';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice.js';
const Account = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        const savedUsername = localStorage.getItem('username');
        const savedRememberMe = localStorage.getItem('rememberMe') === 'true';

        if (savedRememberMe) {
            setUsername(savedUsername || '');
            setRememberMe(savedRememberMe);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (rememberMe) {
            localStorage.setItem('username', username);
            localStorage.setItem('rememberMe', rememberMe);
        } else {
            localStorage.removeItem('username');
            localStorage.removeItem('rememberMe');
        }
    
        try {
            const data = await Account_Service.loginHandle(username, password); // Gọi API đăng nhập
            if (data.code === 200) { // Kiểm tra trạng thái trả về
                // Lưu thông tin token và vai trò vào localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
                localStorage.setItem('username', username);
                dispatch(login({ username, token: data.token, role: data.role }));
                Swal.fire({
                    title: 'Đăng nhập thành công!',
                    text: 'Chào mừng bạn quay trở lại',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
    
                navigate('/'); // Điều hướng về trang chủ sau khi đăng nhập
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: data.message || 'Đăng nhập thất bại',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.message || 'Có lỗi xảy ra,Đại vương ơi!',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            console.error('Login failed', error);
        }
    };

    const handleRegister = async (values) => {
        try {
            const data = await Account_Service.register(values.username, values.password, values.email, values.phone);
            Swal.fire({
                title: 'Success!',
                text: 'Registration successful',
                icon: 'success',
                confirmButtonText: 'OK',
            });
            console.log('Registration successful', data);
            // Handle successful registration (e.g., redirect to login page)
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK',
            });
            console.error('Registration failed', error);
        }
    };

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            phone: '',
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .min(3, 'Username must be at least 3 characters')
                .required('Username is required'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
            phone: Yup.string()
                .matches(/^\+84\d{9,10}$/, 'Phone number must start with +84 and contain 11 digits')
                .required('Phone number is required'),
        }),
        onSubmit: (values) => {
            handleRegister(values);
        },
    });

    const handleGoogleLogin = () => {
        // Chuyển hướng người dùng đến URL OAuth2
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };
 const handleForgotPassword = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Thông báo',
            text: 'Tính năng này đang được phát triển',
            icon: 'info',
            confirmButtonText: 'Đóng',
        });
    };

    const handlePrivacyPolicy = (e) => {
         Swal.fire({
            title: 'Thông báo',
            text: 'Tính năng này đang được phát triển',
            icon: 'info',
            confirmButtonText: 'Đóng',
        });
    };


    return (
        <section className="account py-80">
        <div className="container container-lg">
            <div className="row gy-4">
                {/* Login Card Start */}
                <div className="col-xl-6 pe-xl-5">
                    <form onSubmit={handleLogin} className="border border-gray-100 hover-border-main-600 transition-1 rounded-16 px-24 py-40 h-100">
                        <h6 className="text-xl mb-32">Đăng Nhập</h6>
                        <div className="mb-24">
                            <label htmlFor="username-login" className="text-neutral-900 text-lg mb-8 fw-medium">
                               Tên Tài Khoản <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="common-input"
                                id="username-login"
                                placeholder="Enter Username or Email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="mb-24">
                            <label htmlFor="password-login" className="text-neutral-900 text-lg mb-8 fw-medium">
                                Mật Khẩu
                            </label>
                            <div className="position-relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="common-input"
                                    id="password-login"
                                    placeholder="Enter Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span
                                    className={`toggle-password position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y cursor-pointer ph ${showPassword ? 'ph-eye' : 'ph-eye-slash'}`}
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            </div>
                        </div>
                        <div className="mb-24 mt-48">
                            <div className="flex-align gap-48 flex-wrap">
                                <button type="submit" className="btn btn-main py-18 px-40">
                                    Đăng Nhập
                                </button>
                                <div className="form-check common-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        id="remember"
                                    />
                                    <label className="form-check-label flex-grow-1" htmlFor="remember">
                                        Ghi nhớ tôi
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="mt-48">
                            <Link to="#" className="text-danger-600 text-sm fw-semibold hover-text-decoration-underline"
                            onClick={handleForgotPassword}>
                                Quên mật khẩu?
                            </Link>
                        </div>
                        <div className="mt-48">
                            <button
                                type="button"
                                className="btn btn-secondary py-18 px-40"
                                onClick={handleGoogleLogin}
                            >
                                Đăng Nhập Bằng Google
                            </button>
                        </div>
                    </form>
                </div>
                {/* Login Card End */}
    
                {/* Register Card Start */}
                <div className="col-xl-6">
                    <form onSubmit={formik.handleSubmit} className="border border-gray-100 hover-border-main-600 transition-1 rounded-16 px-24 py-40">
                        <h6 className="text-xl mb-32">Đăng ký</h6>
                        <div className="mb-24">
                            <label htmlFor="username-register" className="text-neutral-900 text-lg mb-8 fw-medium">
                                Tên đăng nhập<span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="common-input"
                                id="username-register"
                                placeholder="Write a username"
                                {...formik.getFieldProps('username')}
                            />
                            {formik.touched.username && formik.errors.username ? (
                                <div className="text-danger">{formik.errors.username}</div>
                            ) : null}
                        </div>
    
                        <div className="mb-24">
                            <label htmlFor="email-register" className="text-neutral-900 text-lg mb-8 fw-medium">
                                Tài Khoản Email <span className="text-danger">*</span>
                            </label>
                            <input
                                type="email"
                                className="common-input"
                                id="email-register"
                                placeholder="Enter Email Address"
                                {...formik.getFieldProps('email')}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="text-danger">{formik.errors.email}</div>
                            ) : null}
                        </div>
    
                        <div className="mb-24">
                            <label htmlFor="phone-register" className="text-neutral-900 text-lg mb-8 fw-medium">
                               Số điện thoại <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="common-input"
                                id="phone-register"
                                placeholder="Enter Phone Number"
                                {...formik.getFieldProps('phone')}
                            />
                            {formik.touched.phone && formik.errors.phone ? (
                                <div className="text-danger">{formik.errors.phone}</div>
                            ) : null}
                        </div>
    
                        <div className="mb-24">
                            <label htmlFor="password-register" className="text-neutral-900 text-lg mb-8 fw-medium">
                                Mật Khẩu <span className="text-danger">*</span>
                            </label>
                            <div className="position-relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="common-input"
                                    id="password-register"
                                    placeholder="Enter Password"
                                    {...formik.getFieldProps('password')}
                                />
                                <span
                                    className={`toggle-password position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y cursor-pointer ph ${showPassword ? 'ph-eye' : 'ph-eye-slash'}`}
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            </div>
                            {formik.touched.password && formik.errors.password ? (
                                <div className="text-danger">{formik.errors.password}</div>
                            ) : null}
                        </div>
    
                        <div className="my-48">
                            <p className="text-gray-500">
                                Dữ liệu của bạn sẽ được bảo mật và không bao giờ được chia sẻ với bất kỳ ai. Bằng cách nhấp vào nút đăng ký, bạn đồng ý với
                                <Link to="#" className="text-main-600 text-decoration-underline"
                                onClick={handlePrivacyPolicy}>
                                    Điều khoản dịch vụ
                                </Link>
                                .
                            </p>
                        </div>
    
                        <div className="mt-48">
                            <button type="submit" className="btn btn-main py-18 px-40">
                                Register
                            </button>
                        </div>
                    </form>
                </div>
                {/* Register Card End */}
            </div>
        </div>
    </section>
    
    );
};

export default Account;
