// components/z-radio-group.js
// let {event} = require('../utils/util')
Component({
  /**
   * 组件的属性列表
   */
  externalClasses: ['my-class'],
  properties: {
    // 单选选中的value值
    value: {
      type: null,
    }
  },
  relations: {
    '../z-radio/index': {
      type: 'child', // 关联的目标子节点
      linked: function (target) {
        // 每次被z-radio插入时执行，target是z-radio节点实例对象，触发在attached生命周期之后
        let { childs } = this.data
        childs.push(target)
        this.setData({ childs })
      }
    }
  },
  observers: {
    value () {
      let { childs, value } = this.data
      // 在获取到所有子z-radio的实例数组后进行遍历
      wx.nextTick(() => {
        childs.map(item => {
          // item 每一个z-radio的实例
          item.setData({ checked: false })
          // 如果group的value被修改了，监听到之后直接用item实例对z-radio进行setData
          if (item.data.value == value) {
            item.setData({ checked: true })
          }
        })
      })
    }
  },
  lifetimes: {
    attached () {
      // // 订阅radio
      // event.once('radio', value => {
      //   console.log(value)
      //   this.triggerEvent('onchange', { value })
      // })
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  data: {
    childs: []
  },
})
