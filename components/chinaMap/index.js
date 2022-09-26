// pkgShare/components/map/index.js
import * as echarts from "../ec-canvas/echarts";
import geoJson from "./china.js";

let pageInstance = {};
let chart;

const app = getApp();
const { screenWidth } = app.globalData.appData;
const tooltipLayout = {
  width: 252,
  height: 124,
};

function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr,
  });
  canvas.setChart(chart);
  echarts.registerMap("china", geoJson);
  const option = {
    tooltip: {
      triggerOn: "click",
      formatter: function () {
        return null;
      },
      position: function (point, params) {
        const [x, y] = point;
        const { data } = params;
        const { name } = data;
        if (name !== "南海诸岛") {
          pageInstance.setPosition({ x, y, data });
          pageInstance.data.selected = true;
          pageInstance.data.lastClickRegion = name;
        }
      },
    },
    animation: false,
    // 地图颜色等配置
    geo: {
      map: "china",
      select: {
        // 切换后残留上次地块颜色
        itemStyle: {
          color: "#A6C5FF",
          // areaColor: "red"
        },
        label: {
          color: "#666C80",
        },
      },
      emphasis: {
        label: {
          color: "#666C80",
        },
        itemStyle: {
          areaColor: "#A6C5FF",
        },
      },
      roam: false,
      zoom: 1.2,
      top: 25,
      label: {
        show: true,
        fontSize: 8,
        color: "#666C80",
      },
      regions: pageInstance.data.regions,
      itemStyle: {
        borderColor: "#BEC1CC",
        areaColor: "#F5F9FF",
      },
    },
    // 对应点击事件响应
    series: [
      {
        type: "map",
        geoIndex: 0,
        data: pageInstance.data.mapData,
      },
    ],
  };

  chart.setOption(option);
  return chart;
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cityList: {
      type: Array,
      value: [],
      observer: "dealMapData",
    },
    show: {
      type: Boolean,
      value: false,
    },
    hit: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    ec: null,
    mapData: [
      {
        name: "北京",
        value: 0,
      },
      {
        name: "天津",
        value: 0,
      },
      {
        name: "上海",
        value: 0,
      },
      {
        name: "重庆",
        value: 0,
      },
      {
        name: "河北",
        value: 0,
      },
      {
        name: "河南",
        value: 0,
      },
      {
        name: "云南",
        value: 0,
      },
      {
        name: "辽宁",
        value: 0,
      },
      {
        name: "黑龙江",
        value: 0,
      },
      {
        name: "湖南",
        value: 0,
      },
      {
        name: "安徽",
        value: 0,
      },
      {
        name: "山东",
        value: 0,
      },
      {
        name: "新疆",
        value: 0,
      },
      {
        name: "江苏",
        value: 0,
      },
      {
        name: "浙江",
        value: 0,
      },
      {
        name: "江西",
        value: 0,
      },
      {
        name: "湖北",
        value: 0,
      },
      {
        name: "广西",
        value: 0,
      },
      {
        name: "甘肃",
        value: 0,
      },
      {
        name: "山西",
        value: 0,
      },
      {
        name: "内蒙古",
        value: 0,
      },
      {
        name: "陕西",
        value: 0,
      },
      {
        name: "吉林",
        value: 0,
      },
      {
        name: "福建",
        value: 0,
      },
      {
        name: "贵州",
        value: 0,
      },
      {
        name: "广东",
        value: 0,
      },
      {
        name: "青海",
        value: 0,
      },
      {
        name: "西藏",
        value: 0,
      },
      {
        name: "四川",
        value: 0,
      },
      {
        name: "宁夏",
        value: 0,
      },
      {
        name: "海南",
        value: 0,
      },
      {
        name: "台湾",
        value: 0,
      },
      {
        name: "香港",
        value: 0,
      },
      {
        name: "澳门",
        value: 0,
      },
      {
        name: "南海诸岛",
        value: 0,
      },
    ],
    regions: [],
    lastClickRegion: "",
    top: 0,
    left: 0,
    value: "",
    city: "",
    tooltipInfo: {},
    legendList: ["32%及以上", "20%-32%", "10%-20%", "1%-10%", "0"],
    throttleX: 0,
  },

  attached() {
    pageInstance = this;
    this._sumThrottle();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _sumThrottle() {
      const baseThrottleX = 200; // 在375的屏幕下超过了200，就让tooltip向右边展示
      const baseScreenWidth = 375;
      this.data.throttleX = (screenWidth * baseThrottleX) / baseScreenWidth;
    },
    setPosition(info) {
      const {
        x,
        y,
        data: { name, value },
      } = info;
      const { throttleX } = this.data;
      const { width, height } = tooltipLayout;
      const left = x > throttleX ? `${x}px - ${width}rpx` : `${x}px`;
      const top = `${y}px - ${height / 2}rpx`;
      const tooltipInfo = {
        left,
        top,
        value,
        name,
      };
      this.setData({ tooltipInfo });
    },
    // 处理渲染需要的数据
    dealMapData() {
      if (!this.data.cityList.length) {
        return;
      }
      const arr = this.data.mapData;
      const regions = [
        {
          name: "南海诸岛",
          label: {
            show: false,
          },
        },
      ];
      arr.forEach((item) => {
        this.data.cityList.forEach((city) => {
          if (item.name === city.name) {
            item.value = parseInt(city.count);
            regions.push({
              name: item.name,
              itemStyle: {
                areaColor: this.getColor(parseInt(city.count)),
              },
            });
          }
        });
      });
      this.setData({
        mapData: arr,
        regions,
        ec: {
          onInit: initChart,
        },
      });
    },

    getColor(val) {
      // regionColors: ["#FF8C19", "#FFA954", "#FFC68C", "#FFD9B3", "#F5F9FF"]
      if (val >= 32) {
        return "#FF8C19";
      } else if (val > 20 && val <= 32) {
        return "#FFA954";
      } else if (val >= 10 && val <= 20) {
        return "#FFC68C";
      } else if (val >= 1 && val < 10) {
        return "#FFD9B3";
      } else {
        return "#F5F9FF";
      }
    },

    // 绑定点击事件
    BindEvent(e) {
      if (e.name === "南海诸岛") {
        chart.dispatchAction({
          type: "unselect",
          name: "南海诸岛",
        });
      } else {
        this.data.aa = true;
        this.data.lastClickRegion = e.name;
        chart.dispatchAction({
          type: "select",
          name: this.data.lastClickRegion,
        });
      }
      this.triggerEvent("closetip");
    },

    // 点击空白区域
    bindtapBox() {
      if (!this.data.selected) {
        this.setData({ tooltipInfo: {} });
        chart.dispatchAction({
          type: "unselect",
          name: this.data.lastClickRegion,
        });
      }
      this.data.selected = false;
    },
  },
});
