// HTTP Client interface
// Implement this interface with your preferred HTTP library

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface HttpClient {
  get(url: string, config?: AxiosRequestConfig): Promise<{ data: any }>;
  post(url: string, data?: any, config?: AxiosRequestConfig): Promise<{ data: any }>;
  put(url: string, data?: any, config?: AxiosRequestConfig): Promise<{ data: any }>;
  delete(url: string, config?: AxiosRequestConfig): Promise<{ data: any }>;
  patch(url: string, data?: any, config?: AxiosRequestConfig): Promise<{ data: any }>;
}

// Axios implementation
export class AxiosHttpClient implements HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  async get(url: string, config?: AxiosRequestConfig): Promise<{ data: any }> {
    const response = await this.axiosInstance.get(url, config);
    return { data: response.data };
  }

  async post(url: string, data?: any, config?: AxiosRequestConfig): Promise<{ data: any }> {
    const response = await this.axiosInstance.post(url, data, config);
    return { data: response.data };
  }

  async put(url: string, data?: any, config?: AxiosRequestConfig): Promise<{ data: any }> {
    const response = await this.axiosInstance.put(url, data, config);
    return { data: response.data };
  }

  async delete(url: string, config?: AxiosRequestConfig): Promise<{ data: any }> {
    const response = await this.axiosInstance.delete(url, config);
    return { data: response.data };
  }

  async patch(url: string, data?: any, config?: AxiosRequestConfig): Promise<{ data: any }> {
    const response = await this.axiosInstance.patch(url, data, config);
    return { data: response.data };
  }

  // 获取axios实例，用于更高级的配置
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// 默认导出
export default AxiosHttpClient;

// 使用示例
/*
import axios from 'axios';
import { AxiosHttpClient } from './http-client';
import { ApiClient } from './api-client';

// 创建axios实例
const axiosInstance = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-token'
  }
});

// 添加请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token等
    console.log('Request:', config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    // 统一错误处理
    if (error.response) {
      console.error('HTTP error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Network error:', error.request);
    } else {
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

// 创建HTTP客户端
const httpClient = new AxiosHttpClient(axiosInstance);

// 创建API客户端
const apiClient = new ApiClient(httpClient);

// 使用API客户端
async function example() {
  try {
    const users = await apiClient.getUsers();
    console.log('Users:', users);
  } catch (error) {
    console.error('Error:', error);
  }
}
*/
