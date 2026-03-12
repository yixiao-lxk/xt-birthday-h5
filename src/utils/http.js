import request from "./request";

// 封装GET请求
export const get = (url, params = {}) => {
  return new Promise((resolve, reject) => {
    request({
      url,
      method: "GET",
      params,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// 封装POST请求
export const post = (url, data = {}, config = {}) => {
  return new Promise((resolve, reject) => {
    request({
      url,
      method: "POST",
      data,
      ...config,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export default {
  get,
  post,
};
