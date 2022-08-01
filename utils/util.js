export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
/**
 * 获取背景音频
 */
let audioContent = null;
export function getBackgroundAudioManager() {
  if (!audioContent) {
    audioContent = wx.getBackgroundAudioManager();
  }
  return audioContent;
}

/**
 * 节流函数
 * @param {Number} time 节流多长时间
 * @param {Function} callback 回调函数
 */
export class Throttler {
  constructor(time) {
    this.timer = null;
    this.time = time || 1000;
  }
  limit(callback) {
    if (!callback || typeof callback !== 'function' || this.timer) {
      return;
    }
    this.timer = setTimeout(() => {
      this.timer = null;
    }, this.time);
    callback();
  }
}
