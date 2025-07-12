// src/store/authSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface User {
    _id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoggedIn: boolean;
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    isLoggedIn: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
            const {user, token} = action.payload;
            state.user = user;
            state.token = token;
            state.isLoggedIn = true;
            localStorage.setItem('token', token);
        },
        logout(state) {
            state.user = null;
            state.token = null;
            state.isLoggedIn = false;
            localStorage.removeItem('token');
        },
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
            state.isLoggedIn = true;
        },
    },
});

export const {loginSuccess, logout, setUser} = authSlice.actions;

export default authSlice.reducer;
