// components/multiBullet/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 初始弹幕列表
    bulletList: {
      type: Array,
      value: [],
      observer: "_handleData",
    },
    // 弹幕行数
    line: {
      type: Number,
      value: 1,
    },
    // 弹幕速度，越大越慢
    duration: {
      type: Number,
      value: 15,
    },
    // 延迟动画时间
    delayTime: {
      type: Number,
      value: 0,
    },
    // 点击弹幕是否暂停动画
    isClickStopAnimate: {
      type: Boolean,
      value: true,
    },
    animateStatus: {
      type: Boolean,
      value: true,
      observer: "_setAnimateStatus",
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    startAnimate: true,
    handleBulletList: [],
    isInit: false,
  },

  pageLifetimes: {
    // 页面左滑回退时进入该生命周期
    show: function () {
      const { isClickStopAnimate, animateStatus } = this.data;
      if (isClickStopAnimate && animateStatus) {
        const timer = setTimeout(() => {
          const { startAnimate } = this.data;
          if (!startAnimate) {
            this.setData({
              startAnimate: true,
            });
          }
          clearTimeout(timer);
        }, 500);
      }
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _setAnimateStatus() {
      const { animateStatus } = this.data;
      this.setData({ startAnimate: animateStatus });
    },

    _handleData() {
      const { bulletList, line } = this.data;
      const getIndex = (index) => {
        return index % line;
      };
      let handleBulletList = [];
      for (let i = 0; i < line; i++) {
        handleBulletList.push({ data: [] });
      }
      bulletList.forEach((item, index) => {
        handleBulletList[getIndex(index)].data.push(item);
      });
      this.setData({ handleBulletList }, () => {
        this._getBulletThrottle();
      });
    },

    _getBulletThrottle() {
      this.createSelectorQuery()
        .selectAll(".z-bullet-list-container")
        .boundingClientRect((res) => {
          this._initBullet(res);
        })
        .exec();
    },

    _initBullet(res) {
      const { duration } = this.data;
      const vt = res[0].width / duration;
      const setDuration = (index) => {
        return (res[index].width / vt).toFixed(2);
      };
      const { handleBulletList } = this.data;
      const newList = handleBulletList.map((item, index) => {
        item.throttleLeft = res[index].width;
        item.duration = setDuration(index);
        return item;
      });
      this.setData({ isInit: true, handleBulletList: newList });
      console.log("newList", newList);
    },

    bindTapBullet(e) {
      const { isClickStopAnimate } = this.data;
      if (isClickStopAnimate) {
        this.setData({
          startAnimate: false,
        });
      }
      const { val } = e.currentTarget.dataset;
      this.triggerEvent("click", { data: val });
    },
  },
});
