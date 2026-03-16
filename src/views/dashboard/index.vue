<!--
 * @Description  : 只是一个描述
 * @Version      : 1.0
 * @Author       : 476782900@qq.com
 * @Date         : 2026-01-13 16:04:19
 * @LastEditors  : chen
 * @LastEditTime : 2026-02-10 15:03:27
 * Copyright (C) 2026 chen. All rights reserved.
-->
<template>
  <main>
    <div class="container">
      <div class="group_box">
        <div class="group_item_box">
          <div class="group_body_box head">
            <img class="part_img" src="@/assets/images/part/head.png" alt="头" />
            <img class="refresh_btn" src="@/assets/images/components/refresh_btn.png" alt=""刷新 />
            <span class="refresh_count_view">123</span>
          </div>
        </div>
        <div class="group_item_box">
          <div class="group_body_box body">
            <img class="part_img" src="@/assets/images/part/body.png" alt="身体" />
            <img class="refresh_btn" src="@/assets/images/components/refresh_btn.png" alt=""刷新 />
            <span class="refresh_count_view">1</span>
          </div>
        </div>
        <div class="group_item_box">
          <div class="group_body_box weapon">
            <img class="part_img" src="@/assets/images/part/weapon.png" alt="武器" />
            <img class="refresh_btn" src="@/assets/images/components/refresh_btn.png" alt=""刷新 />
            <span class="refresh_count_view">2</span>
          </div>
        </div>
      </div>
      <div class="bottom_btn_box">
        <img src="@/assets/images/combine_wait_img.png" alt="">
      </div>
    </div>
  </main>
</template>

<script>
import { getActivityInfo } from "@/utils/api";

export default {
  name: "Dashboard",
  props: {
    config: {
      type: Object,
      default: () => ({ activity_id: 11011 }),
    },
  },
  data() {
    return {

    };
  },
  mounted() {
    this.setRem();
    // 监听可见性变化
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        console.log("visible:true");
        this.getInfo();
      } else {
        console.log("visible:false");
      }
    });
  },
  methods: {
    // 响应式适配：基准宽度 750px
    setRem() {
      const baseWidth = 750;
      const docEl = document.documentElement;
      const clientWidth = docEl.clientWidth || window.innerWidth;
      const rem = (clientWidth / baseWidth) * 100;
      docEl.style.fontSize = `${Math.min(Math.max(rem, 50), 200)}px`;
    },
    // 获取活动信息
    async getInfo() {

    },
  },
};
</script>

<style scoped lang="less">
.container {
  width: 100%;
  height: 12.33rem;
  background: url(@/assets/images/bottom_bg.png) no-repeat top center;
  background-size: 100% auto;
  position: relative;
  overflow: hidden;
  .group_box {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    column-gap: 0.4rem;
    row-gap: 0.21rem;
    width: 5.86rem;
    margin: 3.06rem auto 0;
    .group_item_box {
      width: 2.72rem;
      height: 3.64rem;
      background: url(@/assets/images/components/item_box_bg.png) no-repeat top center;
      background-size: 100% auto;
      .group_body_box {
        position: relative;
        width: 2.72rem;
        height: 3.64rem;
        &.head {
          background: url(@/assets/images/components/head_box_bg.png) no-repeat top center;
          background-size: 100% auto;
        }
        &.body {
          background: url(@/assets/images/components/body_box_bg.png) no-repeat top center;
          background-size: 100% auto;
        }
        &.weapon {
          background: url(@/assets/images/components/weapon_box_bg.png) no-repeat top center;
          background-size: 100% auto;
        }
        .part_img {
          width: 2.72rem;
          height:3.64rem;
        }
        .refresh_btn {
          position: absolute;
          top: 0.62rem;
          right: 0.1rem;
          width: 0.65rem;
          height: 0.21rem;
          cursor: pointer;
        }
        .refresh_count_view {
          position: absolute;
          display: block;
          bottom: 0.74rem;
          right: 0;
          width: 0.36rem;
          font-size: 0.24rem;
          font-weight: bold;
          color: #2d3063;
        }
      }
    }
  }
  .bottom_btn_box {
    text-align: center;
    height: 0.8rem;
    line-height: 0.8rem;
    margin-top: 0.3rem;
    >img {
      cursor: pointer;
      width: 4rem;
      height: 0.8rem;
    }
  }
}
</style>
