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
      const { inBiliApp, isSupport, callNative } = window.biliBridge;
      if (inBiliApp) {
        isSupport("share.showShareMpcWindow").then((support) => {
          if (support) {
            callNative({
              method: "share.showShareMpcWindow",
              data: {
                onShareCallbackId: "123",
                // 自定义分享渠道和顺序
                // 支持渠道参数：['generic'，'dynamic'，'weixin'，'weixin_monment'，'qq'，'sina'，'q_zone'，'copy']
                shareChannelQueue: [
                  "weixin",
                  "q_zone",
                  "weixin_monment",
                  "dynamic",
                ],
                generic: {
                  type: "image", // (必需，包含'text', 'image')
                  title: "分享标题", // (必需)
                  imageUrl: image_url, // (必需)
                  text: "描述一下", // (必需)
                },
                dynamic: {
                  title: "分享标题", // (必需)
                  content_type: 2048, // (必需)
                  cover_url: image_url, // (必需)
                  description: "描述描述描述描述描述描述描述", // (必需)
                  images: ["", "", ""], // (非必需)
                  publish: false, // (非必需)
                  edit_content: "动态预设文案", // (非必需)
                  repost_code: 123, // (非必需)
                  images_online: "", // (非必需)
                },
                weixin: {
                  type: "image", // (必需, 包含'text', 'image', 'video', 'audio', 'web', 'min_program')
                  title: "分享标题", // (必需)
                  text: "描述一下", // (必需)
                  url: "分享链接", // (必需) 如果是分享当前页面，可使用 window.location.href (注意是否带 query 参数)，或找站内对接人要到页面部署的线上地址
                  imageUrl: image_url, // (type为image类型必需)
                  program_id: "123", // (type为min_program类型必需，该id是小程序的原始id, 类似于gh_xxxxxxxx)
                  program_path: "path", // (type为min_program类型必需)
                  media_src: "多媒体地址", //(type为video audio类型必需)
                },
                weixin_monment: {
                  type: "image", // (必需, 包含'text', 'image', 'video', 'audio', 'web')
                  title: "分享标题", // (必需)
                  text: "描述一下", // (必需)
                  url: "分享链接", // (必需)
                  imageUrl: image_url, // (type为image类型必需)
                  media_src: "多媒体地址", // (type为video audio类型必需)
                },
                qq: {
                  type: "image", // (必需, 包含'text', 'image', 'video', 'audio', 'web')
                  title: "分享标题", // (必需)
                  text: "描述一下", // (必需)
                  url: "分享链接", // (必需)
                  imageUrl: image_url, // (type为image类型必需)
                  media_src: "多媒体地址", // (type为video audio类型必需)
                },
                sina: {
                  type: "image", // (必需, 包含'text', 'image', 'video', 'audio', 'web')
                  title: "分享标题", // (必需, 新版新浪客户端不会识别该参数, 但是分享组件里需要识别该参数，业务方可以传自己title或传'哔哩哔哩 (゜-゜)つロ 干杯~')
                  text: "描述一下", // (必需)
                  url: "分享链接", // (必需)
                  imageUrl: image_url, // (type为image类型必需)
                  media_src: "多媒体地址", // (type为video audio类型必需)
                },
                q_zone: {
                  type: "image", // (必需, 包含'text', 'image', 'web')
                  title: "分享标题", // (必需)
                  text: "描述一下", // (必需)
                  url: "分享链接", // (必需)
                  imageUrl: image_url, // (type为image类型必需)
                },
                copy: {
                  type: "image", // (必需, 包含'text', 'image', 'video', 'audio', 'web', copy渠道可以填写'text')
                  title: "分享标题", // (必需)
                  url: "", // (必需)
                },
                default: {
                  type: "image", // (必需, 包含'text', 'image', 'video', 'audio', 'web')
                  title: "分享标题", // (必需)
                  text: "描述一下", // (必需)
                  url: "分享链接", // (必需)
                  imageUrl: image_url, // (type为image类型必需)
                  media_src: "多媒体地址", // (type为video audio类型必需)
                },
              },
              callback: () => {},
            });
          } else {
            // not support
          }
        });
      }
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
