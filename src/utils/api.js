import http from "./http";

//活动详情接口
export const getActivityInfo = (params) => http.get("/star_rail_mecha/detail", params);

//部件刷新（抽取）接口
export const refreshPart = (data) => http.post("/star_rail_mecha/refresh", data);

// 合成机甲接口
export const mergeMecha = (data) => http.post("/star_rail_mecha/synthesize", data);

//获取昵称接口
export const getNickname = (params) => http.get("/up_account/info", params);

//上传图片接口
export const uploadImage = (formData) =>
  http.post("/star_rail_mecha/upload", formData);
