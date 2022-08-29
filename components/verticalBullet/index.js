// components/verticalBullet/index.js
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
    // 弹幕速度，越大越慢
    duration: {
      type: Number,
      value: 5,
    },
    // 延迟动画时间
    delayTime: {
      type: Number,
      value: 0,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isInit: false,
    throttle: 0,
    startAnimate: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _handleData() {
      console.log(this.data.bulletList);
      this.createSelectorQuery()
        .selectAll(".y-bullet-list-container")
        .boundingClientRect((res) => {
          console.log(res);
          this.setData({ throttle: res[0].height, isInit: true });
        })
        .exec();
    },
  },
});
