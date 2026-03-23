<template>
  <van-popup v-model="visible" get-container="body" @closed="closeShare">
    <div class="shareBox_container">
      <div class="shareBox" :class="{'created': isShare}" id="shareBox">
        <img :src="robotImg" alt="机甲图片" class="robot_img">
        <img src="@/assets/images/share/cover.png" v-if="!isShare" alt="SSR盒子" class="ssr_box">
        <p class="nicknameView" :class="{'created': isShare}">@XXX用户名用户名</p>
      </div>
      <div class="shareBtnBox" v-if="!isShare">
        <img src="@/assets/images/share/want_share.png" @click="isShare = true" alt="我要分享">
      </div>
      <div class="shareBtnBox created" v-else>
        <img src="@/assets/images/share/save.png" alt="保存图片">
        <img src="@/assets/images/share/share.png" alt="分享">
      </div>
    </div>
  </van-popup>
</template>

<script>

export default {
  name: "ShareModal",
  data() {
    return {
      visible: false, //分享弹窗是否显示
      robotImg: require('@/assets/images/share/robot.png'), //机甲图片
      isShare: false, //是否分享
    };
  },
  watch: {
  },
  methods: {
    //展示分享
    async showShare(data) {
      this.visible = true;
    },
    //关闭分享
    closeShare() {
      this.visible = false;
      this.isShare = false;
    },
  },
};
</script>

<style scoped lang="less">
// 修改el-dialog样式
/deep/ .el-dialog__header {
  display: none;
}

/deep/ .el-dialog {
  background: none;
  box-shadow: none;
}

/deep/ .el-dialog__body {
  padding: 0;
}

.shareBox_container {
  position: relative;
  width: 6.7rem;
  height: 9.5rem;

  .shareBtnBox {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: 0.72rem;
    left: 0;
    right: 0;
    gap: 0.8rem;
    >img {
      width: 2.97rem;
      height: 0.82rem;
    }

    &.created {
      bottom: 0.4rem;
      >img {
        width: 2.08rem;
        height: 0.58rem;
      }
    }
  }
}

.shareBox {
  width: 100%;
  height: 100%;
  background: url(@/assets/images/share/share_bg1.jpg) no-repeat top center;
  background-size: 100% 100%;

  &.created {
    background: url(@/assets/images/share/share_bg2.jpg) no-repeat top center;
    background-size: 100% 100%;
  }

  .robot_img {
    width: 100%;
    height: 100%;
  }
  .ssr_box {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .nicknameView {
    position: absolute;
    left: 0.82rem;
    bottom: 2.82rem;
    color: #583fe2;
    font-size: 0.24rem;
    font-weight: bold;
    &.created {
      bottom: 2.6rem;
      left: 2.2rem;
    }
  }
}
</style>
