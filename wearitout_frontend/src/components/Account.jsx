import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { login } from '../services/account.js';

const Account = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
            const data = await login(username, password);
            Swal.fire({
                title: 'Success!',
                text: 'Login successful',
                icon: 'success',
                confirmButtonText: 'OK',
            });
            console.log('Login successful', data);
            // Handle successful login (e.g., save token, redirect)
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK',
            });
            console.error('Login failed', error);
            // Handle login failure (e.g., show error message)
        }
    };

    const handleGoogleLogin = () => {
        // Chuyển hướng người dùng đến URL OAuth2
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    return (
        <section className="account py-80">
            <div className="container container-lg">
                <form onSubmit={handleLogin}>
                    <div className="row gy-4">
                        {/* Login Card Start */}
                        <div className="col-xl-6 pe-xl-5">
                            <div className="border border-gray-100 hover-border-main-600 transition-1 rounded-16 px-24 py-40 h-100">
                                <h6 className="text-xl mb-32">Login</h6>
                                <div className="mb-24">
                                    <label
                                        htmlFor="username"
                                        className="text-neutral-900 text-lg mb-8 fw-medium"
                                    >
                                        Username or email address <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="common-input"
                                        id="username"
                                        placeholder="First Name"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="mb-24">
                                    <label
                                        htmlFor="password"
                                        className="text-neutral-900 text-lg mb-8 fw-medium"
                                    >
                                        Password
                                    </label>
                                    <div className="position-relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="common-input"
                                            id="password"
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
                                            <label
                                                className="form-check-label flex-grow-1"
                                                htmlFor="remember"
                                            >
                                                Remember me
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-48">
                                    <Link
                                        to="#"
                                        className="text-danger-600 text-sm fw-semibold hover-text-decoration-underline"
                                    >
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
                            </div>
                        </div>
                        {/* Login Card End */}
                        {/* Register Card Start */}
                        <div className="col-xl-6">
                            <div className="border border-gray-100 hover-border-main-600 transition-1 rounded-16 px-24 py-40">
                                <h6 className="text-xl mb-32">Register</h6>
                                <div className="mb-24">
                                    <label
                                        htmlFor="usernameTwo"
                                        className="text-neutral-900 text-lg mb-8 fw-medium"
                                    >
                                        Username <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="common-input"
                                        id="usernameTwo"
                                        placeholder="Write a username"
                                    />
                                </div>
                                <div className="mb-24">
                                    <label
                                        htmlFor="emailTwo"
                                        className="text-neutral-900 text-lg mb-8 fw-medium"
                                    >
                                        Email address
                                        <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        className="common-input"
                                        id="emailTwo"
                                        placeholder="Enter Email Address"
                                    />
                                </div>
                                <div className="mb-24">
                                    <label
                                        htmlFor="enter-password"
                                        className="text-neutral-900 text-lg mb-8 fw-medium"
                                    >
                                        Password
                                        <span className="text-danger">*</span>
                                    </label>
                                    <div className="position-relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="common-input"
                                            id="enter-password"
                                            placeholder="Enter Password"
                                            defaultValue="password"
                                        />
                                        <span
                                            className={`toggle-password position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y cursor-pointer ph ${showPassword ? 'ph-eye' : 'ph-eye-slash'}`}
                                            onClick={() => setShowPassword(!showPassword)}
                                        />
                                    </div>
                                </div>
                                <div className="my-48">
                                    <p className="text-gray-500">
                                        Your personal data will be used to process your order, support
                                        your experience throughout this website, and for other purposes
                                        described in our
                                        <Link to="#" className="text-main-600 text-decoration-underline">
                                            {" "}
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
                            </div>
                        </div>
                        {/* Register Card End */}
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Account;
