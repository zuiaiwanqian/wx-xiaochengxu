// components/z-radio-group.js
Component({
  /**
   * 组件的属性列表
   */
  externalClasses: ['my-class'],
  properties: {
    // 多选选中的value值
    value: {
      type: Array,
      value: []
    }
  },
  relations: {
    '../z-checkbox/index': {
      type: 'child', // 关联的目标节点应为子节点
      linked: function (target) {
        // 每次被z-checkbox插入时执行，target是z-checkbox节点实例对象，触发在attached生命周期之后
        let { childs } = this.data
        childs.push(target)
        this.setData({ childs })
      }
    }
  },
  observers: {
    value () {
      let { childs, value, onlyValue } = this.data
      // 在获取到所有子z-checkbox的实例数组后进行遍历
      wx.nextTick(() => {
        childs.map(item => {
          // 如果group的value被修改了，监听到之后直接用item实例对z-checkbox进行setData
          // 在 value数组里面就设置为true
          if (value.indexOf(item.data.value) !== -1) {
            item.setData({ checked: true })
          } else {
            item.setData({ checked: false })
          }
          // 如果有only值被未被设置时
          if (item.data.only && onlyValue === null) {
            this.setData({ onlyValue: item.data.value })
          }
        })
      })
    }
  },
  data: {
    childs: [],
    // 特殊值处理 清除除自己之外选中的值
    onlyValue: null,
  },
  methods: {
  }
})
