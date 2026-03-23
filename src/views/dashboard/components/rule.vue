<template>
  <van-popup v-model="visible" get-container="body" @closed="closeShare">
    <div class="shareDialog_body">
      <img src="@/assets/images/rule.png" alt="规则">
    </div>
  </van-popup>
</template>

<script>

export default {
  name: "RuleModal",
  data() {
    return {
      visible: false, //分享弹窗是否显示
    };
  },
  watch: {
  },
  methods: {
    showRule() {
      this.visible = true;
    },
    closeShare() {
      this.visible = false;
    },
  },
};
</script>

<style lang="less">

.el-dialog .el-dialog__header {
  display: none;
}

.el-dialog .el-dialog__body {
  padding: 0;
}
.shareDialog_body {
  position: relative;
  width: 5.54rem;
  height: 6.17rem;
  >img {
    width: 100%;
    height: 100%;
  }
}

</style>
