Page({
  data: {
    keyboardHeight: 0,
    focusCount: 0,
    pageMoveDistance: 0,
  },

  _showToast(text) {
    wx.showToast({
      title: text,
      icon: "none",
      duration: 1000,
    });
  },

  // textarea监听键盘变化bug
  bindKeyboardHeightChange(e) {
    const { height } = e.detail;
    this.setData({ keyboardHeight: height });
    // this.setData({ pageMoveDistance: height ? 200 : 0 });
    // this._showToast(`触发了keyBoardChange改变，键盘高度值为：${height}`);
  },

  // textarea聚焦bug
  bindFocus() {
    const newData = this.data.focusCount + 1;
    // this._showToast(`触发了聚焦${newData}`);
    this.setData({ focusCount: newData });
  },

  bindSubmit() {
    const systemInfo = wx.getSystemInfoSync();
    const { windowHeight } = systemInfo;
    this._showToast(`windowHeight值为${windowHeight}`);
  },
});
