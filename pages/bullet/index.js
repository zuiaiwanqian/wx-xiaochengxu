Page({
  /**
   * 页面的初始数据
   */
  data: {
    originList: [
      { avatar: "", desc: "开始是家里是爷爷奶奶在带他，他" },
      { avatar: "", desc: "我晚上睡觉的时候手机放在" },
      { avatar: "", desc: "我没有文化，孩子要说查作业" },
      { avatar: "", desc: "孩子要上网课，跟我说手机跟我说手机" },
      { avatar: "", desc: "家里是爷爷奶奶在带他，游戏机" },
      { avatar: "", desc: "结尾是这样子的" },
      { avatar: "", desc: "开始是家里是爷爷奶奶在带他，他" },
      { avatar: "", desc: "我晚上睡觉的时候手机放在" },
      { avatar: "", desc: "我没有文化，孩子要说查作业" },
      { avatar: "", desc: "孩子要上网课，跟我说手机跟我说手机" },
      { avatar: "", desc: "家里是爷爷奶奶在带他，游戏机" },
      { avatar: "", desc: "结尾是这样子的" },
      { avatar: "", desc: "开始是家里是爷爷奶奶在带他，他" },
      { avatar: "", desc: "我晚上睡觉的时候手机放在" },
      { avatar: "", desc: "我没有文化，孩子要说查作业" },
      { avatar: "", desc: "孩子要上网课，跟我说手机跟我说手机" },
      { avatar: "", desc: "家里是爷爷奶奶在带他，游戏机" },
      { avatar: "", desc: "结尾是这样子的" },
    ],
  },

  bindTapBullet(e) {
    const { data } = e.detail;
    console.log("data", data);
    wx.navigateTo({
      url: "/pages/index/index",
    });
  },
});
