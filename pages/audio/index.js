const ly = 
[
'[00:26.82]对这个世界如果',
'[00:28.45]你有太多的抱怨',
'[00:30.13]跌倒了就不敢继续往前走',
'[00:33.17]为什么人要这么的脆弱',
'[00:35.57]堕落',
'[00:37.36]请你打开电视看看',
'[00:39.01]多少人为生命在努力',
'[00:41.19]勇敢地走下去',
'[00:42.99]我们是不是该知足',
'[00:45.32]珍惜一切',
'[00:46.59]就算没有拥有',
'[00:49.92]还记得你说家是唯一的城堡',
'[00:53.56]随着稻香河流继续奔跑',
'[00:56.50]微微笑小时候的梦我知道',
'[01:01.59]不要哭让萤火虫带着你逃跑',
'[01:05.25]乡间的歌谣永远的依靠',
'[01:08.32]回家吧回到最初的美好',
'[01:11.98]回到最初的美好',
'[01:36.94]不要这么容易就想放弃',
'[01:39.01]就像我说的',
'[01:40.54]追不到的梦想',
'[01:41.62]换个梦不就得了',
'[01:43.72]为自己的人生鲜艳上色',
'[01:45.72]先把爱涂上喜欢的颜色',
'[01:48.77]笑一个吧功成名就不是目的',
'[01:51.59]让自己快乐快乐',
'[01:52.80]这才叫做意义',
'[01:54.48]童年的纸飞机',
'[01:56.00]现在终于飞回我手里',
'[02:00.09]所谓的那快乐',
'[02:01.46]赤脚在田里追蜻蜓追到累了',
'[02:04.52]偷摘水果被蜜蜂给叮到怕了',
'[02:07.62]谁在偷笑呢',
'[02:09.10]我靠着稻草人吹着风',
'[02:11.06]唱着歌睡着了',
'[02:12.51]哦哦',
'[02:13.14]午后吉他在虫鸣中更清脆',
'[02:15.46]哦哦',
'[02:16.27]阳光洒在路上就不怕心碎',
'[02:18.95]珍惜一切就算没有拥有',
'[02:23.62]还记得你说家是唯一的城堡',
'[02:27.24]随着稻香河流继续奔跑',
'[02:30.14]微微笑小时候的梦我知道',
'[02:35.23]不要哭让萤火虫带着你逃跑',
'[02:38.91]乡间的歌谣永远的依靠',
'[02:41.89]回家吧回到最初的美好',
'[02:45.45]回到最初的美好',
'[02:46.95]还记得你说家是唯一的城堡',
'[02:50.61]随着稻香河流继续奔跑',
'[02:53.56]微微笑小时候的梦我知道',
'[02:58.64]不要哭让萤火虫带着你逃跑',
'[03:02.38]乡间的歌谣永远的依靠',
'[03:05.23]回家吧回到最初的美好',
]
// pages/audio/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fixedAudio: false,
    voiceDetail: {
      video_info: {
        video_num: 'http://www.zuiaiwanqian.com/1.mp3',
        video_time: '218',
        topic_name: '稻香'
      }
    },
    voiceList: [],
    type: 'article',
    voiceId: '1',
    headerHeight: 0,
    audioHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onPageScroll(e) {
    let { headerHeight, audioHeight, fixedAudio } = this.data
    let { scrollTop } = e
    if (scrollTop >= headerHeight + audioHeight) {
      if (!fixedAudio) this.setData({ fixedAudio: true })
    } else {
      if (fixedAudio) this.setData({ fixedAudio: false })
    }
  },
  onLoad: function (options) {
    this._handleHeaderHeight()
    this.init()
  },
  bindChangeType () {
    let { type } = this.data
    if (type === 'article') {
      this.setData({ type: 'card' })
    } else {
      this.setData({ type: 'article' })
    }
  },
  init () {
    let textList = []
    ly.map((item, index) => {
      textList.push({
        index,
        time: item.substring(1,9),
        text: item.substring(10),
        ptype: (index % 2) == 0 ? 1 : 2,
      })
    })
    textList = textList.map((item, index) => {
      if (item.ptype === 1) {
        item.type = 'left'
      }
      if (item.ptype === 2) {
        item.type = 'right'
      }
      item.startTime = this.transferSecond(item.time)
      // if (index === 0) {
      //   item.startTime += 0.01
      // }
      return item
    })
    textList = textList.map((item, index) => {
      textList[index + 1] ? item.endTime = textList[index + 1].startTime : item.endTime = this.data.voiceDetail.video_time
      return item
    })
    console.log(textList)
    this.setData({ voiceList: textList })
  },
  _handleHeaderHeight () {
    wx.createSelectorQuery().select('.header').boundingClientRect(res => {
      this.setData({ headerHeight: res.height })
    }).exec()
    wx.createSelectorQuery().select('.audio-text >>> .main-top').boundingClientRect(res => {
      this.setData({ audioHeight: res.height - 50 })
    }).exec()
  },
  transferSecond (time) {
    // let hour = this.handleTransferSecond(time.substring(0,2))
    let minute = this.handleTransferSecond(time.substring(0,2))
    let second = this.handleTransferSecond(time.substring(3))
    // let minSecond = this.handleTransferSecond(time.substring(9,11))
    return minute * 60 + second
  },
  handleTransferSecond (str) {
    if (str[0] !== 0) return Number(str)
    return Number(str[1])
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})