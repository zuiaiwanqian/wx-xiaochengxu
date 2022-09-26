import { getBackgroundAudioManager, Throttler } from "../../utils/util.js";
const throttler = new Throttler(500);

Component({
  properties: {
    type: {
      type: String,
      value: "text", // card 对话 article 自述 text 纯文本
    },
    audioSrc: {
      type: String,
      value: "",
    },
    totalTime: {
      type: Number,
      value: 0,
    },
    fixedAudio: {
      type: Boolean,
      value: false,
    },
    title: {
      type: String,
      value: "",
    },
    textList: {
      type: Array,
      value: [],
    },
    voiceList: {
      type: Array,
      value: [],
    },
    voiceId: {
      type: String,
      value: "",
    },
    headerHeight: {
      type: Number,
      value: 0,
    },
    topTitle: {
      type: String,
      value: "",
    },
  },
  observers: {
    playTime(newV) {
      this.setData({ startTime: this.transferTime(newV) });
    },
  },
  reportCount: 0,
  data: {
    radio: null,
    isPlay: false, // false 暂停 true 播放  没有暂停就是播放
    playTime: 0,
    allTime: 0,
    startTime: "00:00",
    endTime: "--:--",
    // 时间与px的比例
    pxTimeRatio: 0,
    // timer: null,
    // 进度条距离左边距离
    processLeft: 0,
    // 进度条长度
    processWidth: 0,
    // 滑动到那个view的id
    scrollIntoView: 0,
    // 当前用户是否滑动scroll-view页面了
    isScroll: false,
    // 毫秒控制
    msPlayTime: 0,
    // 是否已经加载全部
    showMore: false,
    // 跳转状态 为了解决ios6执行seek会进paused监听
    seeked: false,
    scrollTop: 0,
    articleTextList: [], // 自述的文本列表dom
    articleTextOneLineHeight: 0,
    fixedRatio: 1, // fixed进度条和普通进度条的比例
    processLeftRatio: 1, // processLeftRation进度条比例
    pageScrollTop: 0, // 页面滚动距离
    fixedMainTopHeight: 0, // 置顶进度条高度
    canPlay: false,
    storageVoiceId: "", // 当前的id
    userControl: false, // 用户控制音频变化
    fileMap: {}, // 动画存放的对象
    showTextToast: false, // 播放错误提示框
    reportCount: 0,
  },
  /**
   * 组件的方法列表
   */
  pageLifetimes: {
    show: function () {
      // 处理左滑右滑返回上一页
      console.log("页面左滑右滑展示。。。。");
      this.startAudio("onShow");
    },
  },
  lifetimes: {
    attached() {
      this.startAudio("attached");
    },
    ready() {
      // this._drawCtx(".process-animation","./animation/data.js", true)
    },
    detached() {
      this.data.fileMap = {};
      clearTimeout(this.scrollTimer);
      this.scrollTimer = null;
    },
  },
  methods: {
    startAudio(pageType) {
      // this.init()
      let { voiceId, msPlayTime, playTime, type } = this.data;
      if (type === "text") return;
      this.data.storageVoiceId = wx.getStorageSync("voiceId");
      this.radio = getBackgroundAudioManager();
      this._watchRadio();
      msPlayTime = this.radio.currentTime || 0;
      playTime = Math.floor(msPlayTime);
      if (this.data.storageVoiceId === voiceId) {
        this.setData(
          { allTime: this.data.totalTime, msPlayTime, playTime },
          () => {
            if (pageType === "attached") {
              this.initTime();
            }
            this._play("playing");
          }
        );
      } else {
        msPlayTime = 0;
        playTime = 0;
        this.setData(
          { msPlayTime, playTime, allTime: this.data.totalTime },
          () => {
            if (pageType === "attached") {
              this.initTime();
            }
            this._play();
          }
        );
      }
    },
    _watchRadio() {
      // 监听音频可以开始播放时
      this.radio.onCanplay((e) => {});
      // 监听音频结束
      this.radio.onEnded((e) => {
        this.setData({
          playTime: 0,
          startTime: 0,
          isPlay: false,
          msPlayTime: 0,
          scrollIntoView: 0,
        });
        wx.removeStorage({
          key: "voiceId",
        });
      });
      // 监听音频暂停
      this.radio.onPause(() => {
        if (this.data.isPlay === true) {
          this.setData({ isPlay: false });
        }
      });
      // 监听音频播放
      this.radio.onPlay(() => {
        if (this.data.isPlay === false) {
          this.setData({ isPlay: true });
        }
        wx.setStorage({
          key: "voiceId",
          data: this.data.voiceId,
        });
        this.data.storageVoiceId = this.data.voiceId;
        // console.log('play', this.data.isPlay)
      });
      this.radio.onStop(() => {
        if (this.data.isPlay === true) {
          this.setData({ isPlay: false });
        }
        wx.removeStorage({
          key: "voiceId",
        });
      });
      this.radio.onTimeUpdate(() => {
        if (this.data.userControl) {
          return;
        }
        if (this.data.storageVoiceId === this.data.voiceId) {
          let msPlayTime = this.radio.currentTime;
          let playTime = Math.floor(msPlayTime);
          // if (msPlayTime === 0) return
          this.setData({ msPlayTime, playTime }, () => {
            // 计算是否需要滑动
            this.scrollCard();
          });
          // console.log('播放时间', this.radio.currentTime)
        }
      });
      this.radio.onError(() => {
        this.handleAudioError();
      });
    },
    // 播放出错
    handleAudioError() {
      console.log("播放错误了。。。");
      this.setData({
        playTime: 0,
        startTime: 0,
        isPlay: false,
        msPlayTime: 0,
        scrollIntoView: 0,
        showTextToast: true,
      });
      let timer = setTimeout(() => {
        this.setData({ showTextToast: false });
        clearTimeout(timer);
      }, 2000);
      wx.removeStorage({
        key: "voiceId",
      });
    },
    // 绘制动画
    // 绘制动画
    _drawCtx(el, file, loop = false) {
      console.log(lottie);
      let query = wx.createSelectorQuery().in(this);
      let domId = el.slice(1);
      query
        .selectAll(el)
        .node((res) => {
          // console.log(res)
          res.map((item) => {
            let canvas = item.node;
            let context = canvas.getContext("2d");
            // const dpr = wx.getSystemInfoSync().pixelRatio;
            canvas.width = canvas._width * 5;
            canvas.height = canvas._height * 5;
            lottie.setup(canvas);
            this.data.fileMap[domId] = lottie.loadAnimation({
              loop,
              autoplay: true,
              animationData: require(file),
              rendererSettings: {
                context,
              },
            });
          });
        })
        .exec();
    },
    initTime() {
      let {
        allTime,
        endTime,
        pxTimeRatio,
        processLeft,
        processWidth,
        type,
        fixedRatio,
        processLeftRatio,
      } = this.data;
      allTime = Math.floor(allTime);
      this.createSelectorQuery()
        .select(".mark-process-btn")
        .boundingClientRect((res) => {
          this.data.processCircleWidth = res.width;
        })
        .exec();
      this.createSelectorQuery()
        .select(".process")
        .boundingClientRect((res) => {
          // console.log('圆的大小', this.data.processCircleWidth)
          processWidth = res.width;
          endTime = this.transferTime(allTime);
          // 歌曲和宽度的比例
          processWidth = processWidth - this.data.processCircleWidth;
          // console.log(processWidth, this.data.processCircleWidth)
          pxTimeRatio = Number(processWidth / allTime).toFixed(2);
          // 进度条距离左边的距离和滑动点的宽度
          processLeft = res.left + this.data.processCircleWidth;
          this.setData({ pxTimeRatio, processLeft, endTime, processWidth });
        })
        .exec();
      this.createSelectorQuery()
        .select(".fixed-process")
        .boundingClientRect((res) => {
          let fixedProcessWidth = res.width - this.data.processCircleWidth;
          let fixedProcessLeft = res.left + this.data.processCircleWidth;
          fixedRatio = Number((fixedProcessWidth / processWidth).toFixed(2));
          processLeftRatio = Number(
            (fixedProcessLeft / processLeft).toFixed(2)
          );
          this.setData({ fixedRatio, processLeftRatio });
        })
        .exec();
      // 计算置顶音频高度
      this.createSelectorQuery()
        .select(".fixed-main-top")
        .boundingClientRect((res) => {
          this.setData({ fixedMainTopHeight: res.height });
        })
        .exec();
      if (type === "article") {
        this.createSelectorQuery()
          .selectAll(".article-text")
          .boundingClientRect((res) => {
            // 所有文本列表的高度
            this.setData({ articleTextList: res });
          })
          .exec();
        this.createSelectorQuery()
          .select(".article-text-absolute")
          .boundingClientRect((res) => {
            // console.log('一排文字所占的高度', res)
            this.setData({ articleTextOneLineHeight: res.height });
          })
          .exec();
      }
      if (type === "card") {
        this.createSelectorQuery()
          .selectAll(".card-audio-text")
          .boundingClientRect((res) => {
            // 所有文本列表的高度
            this.setData({ articleTextList: res });
          })
          .exec();
      }
    },
    init() {
      let { textList, voiceList, type, totalTime } = this.data;
      if (type === "text") {
        voiceList = voiceList.map((item) => {
          item.contents.map((item1) => {
            item[item1.id] = item1.value;
          });
          return item;
        });
        voiceList.map((item, index) => {
          if (item.title === "" && index !== 0) {
            voiceList[index - 1].minMargin = true;
          }
        });
        this.setData({ voiceList });
        console.log("voiceList", voiceList);
      } else {
        textList = textList.map((item, index) => {
          if (item.ptype === 1) {
            item.type = "left";
          }
          if (item.ptype === 2) {
            item.type = "right";
          }
          item.startTime = this.transferSecond(item.time);
          if (index === 0) {
            item.startTime += 0.01;
          }
          return item;
        });
        textList = textList.map((item, index) => {
          textList[index + 1]
            ? (item.endTime = textList[index + 1].startTime)
            : (item.endTime = totalTime);
          return item;
        });
        this.setData({ textList });
        console.log(textList);
      }
    },
    moveProcessBtn(e) {
      let {
        processLeft,
        playTime,
        pxTimeRatio,
        scrollTimer,
        timer,
        processWidth,
        processLeftRatio,
        fixedRatio,
        fixedAudio,
        allTime,
      } = this.data;
      if (allTime === 0) return;
      // this.setData({ userControl: true })
      this.data.userControl = true;
      // this.triggerEvent('pageScroll', { isPageScroll: false })
      this.scrollTimer && clearTimeout(this.scrollTimer);
      let { clientX: x } = e.changedTouches[0];
      // console.log(x)
      if (!fixedAudio) {
        fixedRatio = 1;
        processLeftRatio = 1;
      }
      x = x - processLeft * processLeftRatio;
      if (x <= 0) x = 0;
      if (x >= processWidth * fixedRatio) x = processWidth * fixedRatio;
      playTime = Number((x / (pxTimeRatio * fixedRatio)).toFixed(0));
      if (playTime > allTime) playTime = allTime;
      this.setData({ playTime, msPlayTime: playTime }, () => {});
    },
    endProcessBtn(e) {
      // this.triggerEvent('pageScroll', { isPageScroll: true })
      this.userControlAudio();
    },
    tapProcess(e) {
      throttler.limit(() => {
        let {
          pxTimeRatio,
          processLeft,
          playTime,
          timer,
          scrollTimer,
          processLeftRatio,
          fixedRatio,
          fixedAudio,
          allTime,
        } = this.data;
        if (allTime === 0) return;
        // if(!isPlay) return
        // this.setData({ userControl: true })
        this.data.userControl = true;
        this.scrollTimer && clearTimeout(this.scrollTimer);
        let { x } = e.detail;
        if (!fixedAudio) {
          fixedRatio = 1;
          processLeftRatio = 1;
        }
        x = x - processLeft * processLeftRatio;
        playTime = Number((x / (pxTimeRatio * fixedRatio)).toFixed(0));
        this.setData({ msPlayTime: playTime, playTime }, () => {
          this.userControlAudio();
        });
      });
    },
    playAudio() {
      throttler.limit(() => {
        let { isPlay, allTime } = this.data;
        if (allTime === 0) return;
        this.data.userControl = true;
        // 没有播放就播放
        if (!isPlay) {
          this._play("playing");
        } else {
          this.radio.pause();
          this.setData({ isPlay: false });
        }
        let timer = setTimeout(() => {
          this.data.userControl = false;
          clearTimeout(timer);
        }, 500);
      });
    },
    audioSeeked() {
      let { seeked } = this.data;
      seeked = true;
      this.setData({ seeked });
      let timer = setTimeout(() => {
        this.setData({ seeked: false });
        clearTimeout(timer);
      }, 500);
    },
    loop() {},
    // more的情况滑动
    expandedScroll(type) {
      let {
        textList,
        msPlayTime,
        articleTextList,
        articleTextOneLineHeight,
        isScroll,
        headerHeight,
        fixedMainTopHeight,
      } = this.data;
      if (type === "system") {
        isScroll = false;
        this.setData({ isScroll });
      }
      // 如果是滚动状态不执行滑动
      if (isScroll) return;
      let currentView = null;
      for (let i = 0; i < textList.length; i++) {
        // 点击最前面无音频时，滑动到最前面，为0
        if (msPlayTime <= textList[0].startTime) {
          currentView = 0;
          break;
        }
        if (
          msPlayTime >= textList[i].startTime &&
          msPlayTime < textList[i].endTime
        ) {
          currentView = i;
          break;
        }
      }
      if (currentView === null) return;
      // if (this.data.type === 'article') {
      let pageScrollTop = 0;
      if (currentView === 0) {
        pageScrollTop = headerHeight;
      } else {
        if (this.data.type === "article") {
          pageScrollTop =
            articleTextList[currentView].top -
            fixedMainTopHeight -
            articleTextOneLineHeight;
        } else {
          pageScrollTop =
            articleTextList[currentView].top - fixedMainTopHeight - 20;
        }
      }
      // console.log('进入了', pageScrollTop)
      if (pageScrollTop === this.data.pageScrollTop && type !== "system")
        return;
      this.setData({ pageScrollTop }, () => {
        wx.pageScrollTo({
          scrollTop: pageScrollTop,
          duration: 500,
        });
      });
      console.log("进入了页面滚动。。。", pageScrollTop, articleTextList);
      console.log("fixedMainTopHeight", fixedMainTopHeight);
      return;
      // }
    },
    // 滑动交互
    noExpandedScroll(type) {
      let {
        textList,
        playTime,
        scrollIntoView,
        isScroll,
        msPlayTime,
        showMore,
        articleTextList,
        articleTextOneLineHeight,
      } = this.data;
      // 改变scrollIntoView
      // 如果用户滑动了页面，就不执行自动滑动
      if (type === "system") {
        isScroll = false;
        this.setData({ isScroll });
      }
      // 如果是展开状态不执行滑动
      if (showMore) return;
      // 如果是滚动状态不执行滑动
      if (isScroll) return;
      let currentView = null;
      for (let i = 0; i < textList.length; i++) {
        // 点击最前面无音频时，滑动到最前面，为0
        if (msPlayTime <= textList[0].startTime) {
          currentView = 0;
          break;
        }
        if (
          msPlayTime >= textList[i].startTime &&
          msPlayTime < textList[i].endTime
        ) {
          currentView = i;
          break;
        }
      }
      if (currentView === null) return;
      // 文本时的滚动
      if (this.data.type === "article") {
        let scrollTop = 0;
        for (let i = 0; i < articleTextList.length; i++) {
          if (i < currentView) {
            scrollTop += articleTextList[i].height;
          } else {
            break;
          }
        }
        scrollTop = scrollTop - articleTextOneLineHeight;
        if (scrollTop === this.data.scrollTop && type !== "system") return;
        this.setData({ scrollTop });
        // console.log('进入了自动滚动。。。', this.data.scrollTop)
        return;
      } else {
        // card卡片滚动
        // index 为 0 scrollIntoView都为0
        if (currentView === 0) {
          // type为system时 不return
          if (currentView === scrollIntoView && type !== "system") return;
          scrollIntoView = 0;
        } else {
          // 第二行为参照物 所以每次需要scrollIntoView需要为当前currentView的减去1
          // let typeCurrentView =  null
          // currentView = currentView
          if (currentView == scrollIntoView && type !== "system") return;
          scrollIntoView = currentView;
        }
        // console.log('zhm进入了。。。', currentView, scrollIntoView)
        this.setData({ scrollIntoView });
      }
    },
    scrollCard(type) {
      let { showMore } = this.data;
      if (showMore) {
        this.expandedScroll(type);
      } else {
        this.noExpandedScroll(type);
      }
    },
    // 滑动中事件
    scrollViewDragging(e) {
      // console.log('滑动', e)
      let { isScroll, isPlay, showMore } = this.data;
      if (showMore) return;
      // console.log(isScroll)
      // console.log('进入了滑动', isPlay, isScroll)
      if (isPlay && !isScroll) {
        // 播放时才处理自动上滑
        // console.log('进入了滑动')
        if (!isScroll) this.setData({ isScroll: true });
      }
    },
    // 滑动结束事件
    scrollViewDragend(e) {
      // console.log('滑动结束', e)
      let { scrollTimer, isPlay, isScroll, showMore } = this.data;
      if (showMore) return;
      if (isPlay && isScroll) {
        //
        clearTimeout(this.scrollTimer);
        this.scrollTimer = null;
        this.scrollTimer = setTimeout(() => {
          // 2s过后回到当前音乐播放地点
          // console.log('执行滑动。。。')
          this.scrollCard("system");
        }, 2000);
        // this.setData({ scrollTimer })
      }
    },
    // 点击下方文字
    tapText(e) {
      throttler.limit(() => {
        let { time } = e.currentTarget.dataset;
        let { playTime, msPlayTime, allTime } = this.data;
        if (allTime === 0) return;
        // this.setData({ userControl: true })
        this.data.userControl = true;
        clearTimeout(this.scrollTimer);
        msPlayTime = time;
        playTime = Math.floor(msPlayTime);
        this.setData({ msPlayTime, playTime }, () => {
          this.userControlAudio();
        });
      });
    },
    _play(type) {
      let { msPlayTime, audioSrc } = this.data;
      // console.log('当前的msPlayTime', msPlayTime)
      if (this.radio.src !== audioSrc) {
        this.radio.startTime = msPlayTime;
        this.radio.protocol = "https";
        this.radio.coverImgUrl =
          "https://kf-ui.cdn-go.cn/weapp-image/latest/weapp-sndt/images/logo.png";
        this.radio.title = "腾讯未成年人家长服务平台";
        this.radio.src = audioSrc;
        this.radio.play();
        // console.log('第一次播放。。。。')
      } else {
        this.radio.startTime = msPlayTime;
        this.radio.play();
        // 如果从外面进来还在播放就不管
        if (type !== "playing") {
          this.radio.seek(msPlayTime);
        }
      }
      this.setData({ isPlay: true });
      this.scrollCard();
      // this.setData({ userControl: false })
    },
    // 手动操作音乐播放
    userControlAudio(type = "system") {
      // console.log('进入了userControlAudio。。。')
      let { radio, isPlay, msPlayTime, audioSrc } = this.data;
      this.setData({ isScroll: false });
      clearTimeout(this.scrollTimer);
      if (!isPlay) {
        this._play();
      } else {
        this.radio.seek(msPlayTime);
        this.scrollCard();
        // this.setData({ userControl: false })
      }
      let timer = setTimeout(() => {
        // this.setData({ userControl: false })
        this.data.userControl = false;
        clearTimeout(timer);
      }, 500);
    },
    transferTime(time) {
      time = +time;
      if (typeof time !== "number") return "";
      let m = time / 60 > 9 ? time / 60 : "0" + time / 60;
      m = m.toString().substring(0, 2);
      let s = time % 60 > 9 ? time % 60 : "0" + (time % 60);
      s = s.toString().substring(0, 2);
      return `${m}:${s}`;
    },
    transferSecond(time) {
      let hour = this.handleTransferSecond(time.substring(0, 2));
      let minute = this.handleTransferSecond(time.substring(3, 5));
      let second = this.handleTransferSecond(time.substring(6, 8));
      let minSecond = this.handleTransferSecond(time.substring(9, 11));
      return hour * 3600 + minute * 60 + second + minSecond / 100;
    },
    handleTransferSecond(str) {
      if (str[0] !== 0) return Number(str);
      return Number(str[1]);
    },
    bindMore() {
      let { showMore } = this.data;
      showMore = !showMore;
      this.setData({ showMore }, () => {
        if (!showMore) {
          wx.pageScrollTo({
            scrollTop: 0,
            duration: 300,
          });
          // this.triggerEvent('changePageTop', { top: 0 })
        }
        this.scrollCard("system");
      });
    },
    // 用户滑动了
    touchMove() {
      let { isScroll } = this.data;
      if (!isScroll) this.setData({ isScroll: true });
    },
    catchMove() {
      return false;
    },
  },
});
