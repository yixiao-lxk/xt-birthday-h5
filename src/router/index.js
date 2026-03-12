/*
 * @Description  : 只是一个描述
 * @Version      : 1.0
 * @Author       : 476782900@qq.com
 * @Date         : 2026-01-13 15:27:58
 * @LastEditors  : chen
 * @LastEditTime : 2026-01-13 16:04:59
 * @FilePath     : \xingtie\src\router\index.js
 * Copyright (C) 2026 chen. All rights reserved.
 */
import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/dashboard/index.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
