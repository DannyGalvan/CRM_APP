import { api } from '../config/axios/interceptors';
import { ChangePasswordForm } from '../pages/auth/ChangePasswordPage';
import { LoginForm } from '../pages/auth/LoginPage';
import { ApiResponse, AuthResponse } from '../types/ApiResponse';
import { ValidationFailure } from '../types/ValidationFailure';

export const login = async (credentials : LoginForm) => {
  return await api.post<any,ApiResponse<AuthResponse|ValidationFailure[]>,any>('/Auth', credentials);
};

export const changePassword = async (credentials : ChangePasswordForm) => {
  return await api.post<any,ApiResponse<string|ValidationFailure[]>,any>('/Auth/ResetPassword', credentials);
}