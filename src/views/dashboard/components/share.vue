<template>
  <van-popup v-model="visible" get-container="body" @closed="closeShare">
    <div class="shareBox_container">
      <div class="shareBox" :class="{ created: isShare }" id="shareBox">
        <img :src="robotImg" alt="机甲图片" class="robot_img" />
        <img src="@/assets/images/share/cover.png" v-if="!isShare" alt="SSR盒子" class="ssr_box" />
        <span class="nicknameView" :class="{ created: isShare }">@{{ nickname }}</span>
        <img src="@/assets/images/share/qrcode.png" v-if="isShare" alt="二维码" class="qrcode">
      </div>
      <div class="shareBtnBox" v-if="!isShare">
        <img src="@/assets/images/share/want_share.png" @click.stop="generateImg" alt="我要分享" />
      </div>
      <div class="shareBtnBox created" v-else>
        <img @click.stop="saveImg" src="@/assets/images/share/save.png" alt="保存图片" />
        <img @click.stop="openBilibiliShare"  src="@/assets/images/share/share.png" alt="分享" />
      </div>
    </div>
  </van-popup>
</template>

<script>
import html2canvas from "html2canvas";
import { Toast } from "vant";
import { getNickname,uploadImage } from "@/utils/api";
import biliShare from "@bilibili/share-h5-next";
import '@bilibili/share-h5-next/dist/share-h5.css';

export default {
  name: "ShareModal",
  data() {
    return {
      visible: false, //分享弹窗是否显示
      robotImg: "",//机甲图片
      isShare: false, //是否分享
      base64Img: '', //分享图片base64
      image_url: "", // 分享图片url
      nickname: "", //用户昵称
      activityId: "", //活动id
    };
  },
  watch: {},
  methods: {
    //展示分享
    async showShare(data) {
      // 获取用户昵称
      const res = await getNickname();
      this.nickname = res.name;
      this.activityId = data.activity_id || "";
      this.robotImg = data.poster_url || "";
      this.visible = true;
      document.body.classList.add("van-overflow-hidden");
    },
    //关闭分享
    closeShare() {
      this.visible = false;
      this.isShare = false;
      document.body.classList.remove("van-overflow-hidden");
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
                  Toast("保存成功");
                } else {
                  Toast(info.errMsg || "保存失败");
                }
                // this.closeShare();
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
      Toast("保存成功");
      // this.closeShare();
    },
    //打开分享
    async openBilibiliShare() {
      const res = await this.uploadImage();
      //调用分享方法
      this.share(res.image_url);
      // this.closeShare();
    },
    // 上传分享图片
    async uploadImage() {
      try {
        // 将base64图片转换为Blob对象
        const blob = await this.base64ToBlob(this.base64Img);

        // 创建FormData对象
        const formData = new FormData();
        formData.append("file", blob, "share_image.png");
        formData.append("activity_id", this.activityId);

        // 调用上传接口
        const res = await uploadImage(formData);
        return res;
      } catch (error) {
        console.error("上传失败:", error);
        throw error;
      }
    },
    // base64转Blob
    base64ToBlob(base64) {
      return new Promise((resolve) => {
        const arr = base64.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }

        resolve(new Blob([u8arr], { type: mime }));
      });
    },
    //实际分享逻辑
    share(image_url) {
      console.log("share", image_url);
      const _this = this;
      const pageInfo = window.__BILIACT_PAGEINFO__ || {};
      const options = {
        title: pageInfo.shareTitle || "星穹铁道生日会", // 分享标题
        desc: pageInfo.shareText || "快来参与星穹铁道生日会活动吧！", // 分享描述
        link: location.href, // 分享链接，必传
        pics: image_url,
        share_from_topic_id: 1332371,
        share_from_topic_name: "星穹铁道生日会",
        pictureList: [
          {
            img_height: 950,
            img_size: 1000,
            img_src: image_url,
            img_width: 670,
          },
        ],
        success: () => {
          Toast("分享成功");
          _this.closeShare();
        },
        cancel: () => {
          Toast("取消分享");
        },
      };
      biliShare.showWindowTypeImage(options);
    },
  },
};
</script>
<style lang="less">
  .van-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .7);
}
</style>
<style scoped lang="less">
.van-popup {
  position: fixed;
  max-height: 100%;
  overflow-y: auto;
  -webkit-transition: -webkit-transform .3s;
  transition: -webkit-transform .3s;
  transition: transform .3s;
  transition: transform .3s, -webkit-transform .3s;
  transition: transform .3s, -webkit-transform .3s;
  -webkit-overflow-scrolling: touch;
}
.shareBox_container {
  position: relative;
  width: 6.7rem;
  height: 9.5rem;
  overflow: hidden;

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
  position: relative;
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
