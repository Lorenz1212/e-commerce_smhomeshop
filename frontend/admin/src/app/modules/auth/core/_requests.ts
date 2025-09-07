import axios from "axios";
import { AuthModel, UserModel } from "./_models";
import { ApiResponse } from "@@@@/types";

const isLive = !["localhost", "127.0.0.1"].includes(window.location.hostname);

const API_URL = (isLive)?import.meta.env.VITE_APP_API_URL_LIVE:import.meta.env.VITE_APP_API_URL;

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/admin/me`;
export const LOGIN_URL = `${API_URL}/admin/login`;
export const REGISTER_URL = `${API_URL}/admin/register`;
export const REQUEST_PASSWORD_URL = `${API_URL}/admin/forgot_password`;
export const REQUEST_VERIFY_OTP_URL = `${API_URL}/admin/verify_otp`;
export const REQUEST_RESET_PASSWORD_URL = `${API_URL}/admin/reset_password`;
export const REQUEST_SETUP_PASSWORD_URL = `${API_URL}/admin/setup_password`;
export const REQUEST_VALIDATE_ACCOUNT_URL = `${API_URL}/admin/validate_account`;
// Server should return AuthModel
export function login(email: string, password: string) {
  return axios.post<ApiResponse<AuthModel>>(LOGIN_URL, {
    email,
    password,
  });
}

// Server should return AuthModel
export function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  password_confirmation: string
) {
  return axios.post(REGISTER_URL, {
    email,
    first_name: firstname,
    last_name: lastname,
    password,
    password_confirmation,
  });
}

export function requestPassword(email: string) {
  return axios.post(REQUEST_PASSWORD_URL, {
    email,
  });
}

export function getUserByToken(token: string) {
  return axios.post<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {
    api_token: token,
  });
}

export function verifyOTP(formValue: any) {
  return axios.post(REQUEST_VERIFY_OTP_URL, formValue);
}

export function resetPassword(formValue: any) {
  return axios.post(REQUEST_RESET_PASSWORD_URL, formValue);
}

export function validateAccount(formValue: any) {
  return axios.post(REQUEST_VALIDATE_ACCOUNT_URL, formValue);
}

export function setupPassword(formValue: any) {
  return axios.post(REQUEST_SETUP_PASSWORD_URL, formValue);
}
