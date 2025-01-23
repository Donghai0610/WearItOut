import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Account_Service, { login, register } from '../services/account.js';
import * as Yup from 'yup';
import { useFormik } from 'formik';

const Account = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const savedUsername = localStorage.getItem('username');
        const savedPassword = localStorage.getItem('password');
        const savedRememberMe = localStorage.getItem('rememberMe') === 'true';

        if (savedRememberMe) {
            setUsername(savedUsername || '');
            setPassword(savedPassword || '');
            setRememberMe(savedRememberMe);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (rememberMe) {
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
            localStorage.setItem('rememberMe', rememberMe);
        } else {
            localStorage.removeItem('username');
            localStorage.removeItem('password');
            localStorage.removeItem('rememberMe');
        }
    
        try {
            const data = await Account_Service.login(username, password); // Gọi API đăng nhập
            if (data.code === 200) { // Kiểm tra trạng thái trả về
                // Lưu thông tin token và vai trò vào localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
    
                Swal.fire({
                    title: 'Success!',
                    text: 'Login successful',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
    
                console.log('Login successful', data);
                navigate('/'); // Điều hướng về trang chủ sau khi đăng nhập
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: data.message || 'Login failed',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.message || 'Something went wrong',
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

    return (
        <section className="account py-80">
        <div className="container container-lg">
            <div className="row gy-4">
                {/* Login Card Start */}
                <div className="col-xl-6 pe-xl-5">
                    <form onSubmit={handleLogin} className="border border-gray-100 hover-border-main-600 transition-1 rounded-16 px-24 py-40 h-100">
                        <h6 className="text-xl mb-32">Login</h6>
                        <div className="mb-24">
                            <label htmlFor="username-login" className="text-neutral-900 text-lg mb-8 fw-medium">
                                Username or email address <span className="text-danger">*</span>
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
                                Password
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
                                    Log in
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
                                        Remember me
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="mt-48">
                            <Link to="#" className="text-danger-600 text-sm fw-semibold hover-text-decoration-underline">
                                Forgot your password?
                            </Link>
                        </div>
                        <div className="mt-48">
                            <button
                                type="button"
                                className="btn btn-secondary py-18 px-40"
                                onClick={handleGoogleLogin}
                            >
                                Login with Google
                            </button>
                        </div>
                    </form>
                </div>
                {/* Login Card End */}
    
                {/* Register Card Start */}
                <div className="col-xl-6">
                    <form onSubmit={formik.handleSubmit} className="border border-gray-100 hover-border-main-600 transition-1 rounded-16 px-24 py-40">
                        <h6 className="text-xl mb-32">Register</h6>
                        <div className="mb-24">
                            <label htmlFor="username-register" className="text-neutral-900 text-lg mb-8 fw-medium">
                                Username <span className="text-danger">*</span>
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
                                Email address <span className="text-danger">*</span>
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
                                Phone Number <span className="text-danger">*</span>
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
                                Password <span className="text-danger">*</span>
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
                                Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our
                                <Link to="#" className="text-main-600 text-decoration-underline">
                                    privacy policy
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
