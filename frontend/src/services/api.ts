import axios from 'axios';

// Định nghĩa Base URL cho Backend .NET
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5232/api';

// Khởi tạo instance của Axios
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hàm hỗ trợ set token thủ công nếu cần
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Interceptor: Tự động đính kèm Token JWT vào mỗi Request nếu có
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor: Xử lý lỗi toàn cục (Vd: Token hết hạn, lỗi máy chủ)
api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401) {
    // Nếu token hết hạn hoặc lỗi xác thực -> Đăng xuất người dùng
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
  }
  return Promise.reject(error);
});
