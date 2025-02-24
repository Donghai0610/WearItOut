import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Đảm bảo bạn import đúng authReducer

const store = configureStore({
    reducer: {
        auth: authReducer, // Thêm auth vào reducer
    }
});

export default store;
