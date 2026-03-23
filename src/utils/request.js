/*
 * @Description  : 只是一个描述
 * @Version      : 1.0
 * @Author       : 476782900@qq.com
 * @Date         : 2026-01-27 16:36:20
 * @LastEditors  : chen
 * @LastEditTime : 2026-01-30 15:18:44
 * @FilePath     : \xingtie_h5\src\utils\request.js
 * Copyright (C) 2026 chen. All rights reserved.
 */
import axios from "axios";
import { Toast } from "vant";
// 创建axios实例
const request = axios.create({
  baseURL: "/api", // 基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.error("请求错误:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    const res = response.data;

    // 根据后端返回的状态码处理
    if (res.err_code === 0) {
      return Promise.resolve(res.result);
    } else {
      // 处理错误情况
      Toast.error(res.error_msg);
      return Promise.reject(new Error(res.error_msg || "请求失败"));
    }
  },
  (error) => {
    // 对响应错误做点什么
    console.error("响应错误:", error);

    // 处理网络错误、超时等情况
    let message = "请求失败";
    if (error.message.includes("timeout")) {
      message = "请求超时，请稍后重试";
    } else if (error.message.includes("Network Error")) {
      message = "网络错误，请检查网络连接";
    }

    return Promise.reject(new Error(message));
  }
);

export default request;
