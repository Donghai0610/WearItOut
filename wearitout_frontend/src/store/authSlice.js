import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    username: '',
    role: '',
    token: ''
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.username = action.payload.username;
            state.token = action.payload.token;
            state.role = action.payload.role;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.username = '';
            state.token = '';
            state.role = '';
        },
        checkAuth: (state) => {
            const token = localStorage.getItem('token');
            if (token) {
                state.isAuthenticated = true;
                state.token = token;
                state.username = localStorage.getItem('username');
                state.role = localStorage.getItem('role');
            } else {
                state.isAuthenticated = false;
            }
        }
    }
});

export const { login, logout, checkAuth } = authSlice.actions;

export default authSlice.reducer;
