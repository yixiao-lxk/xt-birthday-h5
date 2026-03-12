import http from "./http";

//查询用户信息接口
export const getActivityInfo = (params) => http.get("/activity/info", params);

//触发攻击接口
export const triggerAttack = (data) => http.post("/activity/attack", data);

//上传图片接口
export const uploadImage = (formData) =>
  http.post("/activity/upload", formData);
