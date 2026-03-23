<template>
  <van-popup v-model="visible" get-container="body" @closed="closeShare">
    <div class="shareBox_container">
      <div class="shareBox" :class="{ created: isShare }" id="shareBox">
        <img :src="robotImg" alt="机甲图片" class="robot_img" />
        <img src="@/assets/images/share/cover.png" v-if="!isShare" alt="SSR盒子" class="ssr_box" />
        <span class="nicknameView" :class="{ created: isShare }">@XXX用户名用户名</span>
        <img src="@/assets/images/share/qrcode.png" v-if="isShare" alt="二维码" class="qrcode">
      </div>
      <div class="shareBtnBox" v-if="!isShare">
        <img src="@/assets/images/share/want_share.png" @click="generateImg" alt="我要分享" />
      </div>
      <div class="shareBtnBox created" v-else>
        <img @click="saveImg" src="@/assets/images/share/save.png" alt="保存图片" />
        <img src="@/assets/images/share/share.png" alt="分享" />
      </div>
    </div>
  </van-popup>
</template>

<script>
import html2canvas from "html2canvas";
import { Toast } from "vant";

export default {
  name: "ShareModal",
  data() {
    return {
      visible: false, //分享弹窗是否显示
      robotImg: "", //机甲图片
      isShare: false, //是否分享
      base64Img: "", //分享图片base64
    };
  },
  watch: {},
  methods: {
    //展示分享
    async showShare(data) {
      this.robotImg = require(`@/assets/images/generate/${data}.png`);
      this.visible = true;
    },
    //关闭分享
    closeShare() {
      this.visible = false;
      this.isShare = false;
    },
    //生成图片
    async generateImg() {
      this.isShare = true;
      await this.$nextTick();
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      );
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready.catch(() => undefined);
      }
      const shareBox = document.getElementById("shareBox");
      if (!shareBox) return;
      const exportWidth = 670;
      const exportHeight = 950;
      const canvas = await html2canvas(shareBox, {
        backgroundColor: null,
        useCORS: true,
        scale: 1,
        width: exportWidth,
        height: exportHeight,
        windowWidth: exportWidth,
        windowHeight: exportHeight,
        onclone: (clonedDoc) => {
          const clonedEl = clonedDoc.documentElement;
          if (clonedEl) clonedEl.style.fontSize = "100px";
          if (clonedDoc.body) clonedDoc.body.style.margin = "0";

          const clonedShareBox = clonedDoc.getElementById("shareBox");
          if (!clonedShareBox) return;

          const container = clonedShareBox.closest(".shareBox_container");
          if (container) {
            container.style.width = `${exportWidth}px`;
            container.style.height = `${exportHeight}px`;
            container.style.transform = "none";
            container.style.transformOrigin = "top left";
          }

          clonedShareBox.style.width = `${exportWidth}px`;
          clonedShareBox.style.height = `${exportHeight}px`;
        },
      });
      this.base64Img = canvas.toDataURL("image/png");
    },
    //保存图片
    saveImg() {
      // 检查是否在B站App中
      const { inBiliApp, isSupport, callNative } = window.biliBridge;
      if (inBiliApp) {
        isSupport("ability.saveImageToPhotosAlbum").then((support) => {
          if (support) {
            callNative({
              method: "ability.saveImageToPhotosAlbum",
              data: {
                base64Data: this.base64Img, // base64 字符串，上限 2M，filePath 与 base64Data 必填其一
                hintMsg: "需要保存图片到相册，以便您可以分享给朋友", // GR 要求申请权限时必须要给予相应的场景说明。
              },
              callback: (info) => {
                console.log("保存图片结果:", info);
                // 保存成功后关闭弹窗
                if (info.code === 0) {
                  Toast.success("保存成功");
                } else {
                  Toast.error(info.errMsg || "保存失败");
                }
                this.closeShare();
              },
            });
          } else {
            // not support
            this.downloadImage();
          }
        });
      } else {
        this.downloadImage();
      }
    },
    //下载图片
    downloadImage() {
      const link = document.createElement("a");
      link.href = this.base64Img;
      link.download = "share_image.png";

      // 触发下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      Toast.success("保存成功");
      this.closeShare();
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
  .qrcode {
    position: absolute;
    left: 0.26rem;
    bottom: 1.35rem;
    width: 1.34rem;
    height: 1.34rem;
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
