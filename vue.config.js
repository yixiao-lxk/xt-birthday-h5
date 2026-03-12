/*
 * @Description  : 只是一个描述
 * @Version      : 1.0
 * @Author       : 476782900@qq.com
 * @Date         : 2026-01-18 12:18:56
 * @LastEditors  : chen
 * @LastEditTime : 2026-01-19 21:51:55
 * @FilePath     : \xingtie\xingtie_h5\vue.config.js
 * Copyright (C) 2026 chen. All rights reserved.
 */
const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    devtool: false, // 禁用 source map
  },
  chainWebpack: (config) => {
    // 拆分代码块，确保每个包小于 500KB
    config.optimization.splitChunks({
      chunks: "all",
      maxInitialRequests: 5,
      maxAsyncRequests: 5,
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        vendor: {
          name: "chunk-vendor",
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: "initial",
          maxSize: 500 * 1024, // 500KB
        },
        common: {
          name: "chunk-common",
          minChunks: 2,
          priority: -30,
          chunks: "all",
          maxSize: 500 * 1024, // 500KB
        },
      },
    });
  },
});
