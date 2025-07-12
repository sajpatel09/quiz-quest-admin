// src/actions/auth.ts
import api from '../lib/axios';
import { loginSuccess, logout, setUser } from '../store/authSlice';
import { AnyAction, ThunkAction } from '@reduxjs/toolkit';
import { IRootState } from '../store';

type AppThunk<ReturnType = void> = ThunkAction<ReturnType, IRootState, unknown, AnyAction>;

export const loginUser = (credentials: any): AppThunk<Promise<any>> => async (dispatch) => {
    try {
        const response = await api.post('/auth/login', credentials);
        const { user, accessToken } = response.data;

        dispatch(loginSuccess({ user, token: accessToken }));
        return response.data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

export const fetchUserProfile = (): AppThunk => async (dispatch) => {
    try {
        const response = await api.get('/auth/me');
        dispatch(setUser(response.data.user));
    } catch (error) {
        console.error('Failed to fetch user profile:', error);
        dispatch(logout());
    }
};
