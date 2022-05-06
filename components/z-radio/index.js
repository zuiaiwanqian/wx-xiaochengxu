// components/z-data-checkbox.js
// let { event } = require('../utils/util')
Component({
  /**
   * 组件的属性列表
   */
  externalClasses: ['my-class'],
  properties: {
    // 是否开启自动勾选 单个时有效
    autoCheck: {
      type: Boolean,
      value: false,
    },
    // value值
    value: {
      type: null, // 不限
    },
    // 是否选中
    checked: {
      type: Boolean,
      value: false,
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      value: false,
    },
    // 选中的图片
    selectedImg: {
      type: String,
      value: 'https://kf-ui.cdn-go.cn/weapp-image/latest/weapp-sndt/images/new/single_selected.png',
    },
    // 未选中的图片
    noSelectedImg: {
      type: String,
      value: 'https://kf-ui.cdn-go.cn/weapp-image/latest/weapp-sndt/images/single_normal.png',
    },
    // 禁用的图片
    disabledImg: {
      type: String,
      value: 'https://kf-ui.cdn-go.cn/weapp-image/latest/weapp-sndt/images/single_disabled.png',
    }
  },
  // 获取与z-radio-group的联系
  relations: {
    '../z-radio-group/index': {
      type: 'parent', // 关联的目标节点应为父节点
      linked: function (target) {
        // 每次被插入到z-radio-group时执行，target是z-radio-group节点实例对象，触发在attached生命周期之后
        // console.log(target)
        this.setData({ parent: target })
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    parent: null
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 点击单选按钮
    tapRadio () {
      let { value, parent, disabled, autoCheck } = this.data
      if (disabled) return
      // 单选框组的情况
      if (parent) {
        // 1.第一种实现方式如果有parent 直接通过relations拿到的实例，在这个组件里面提交一个事件
        parent.triggerEvent('onchange', { value, })

        // 2.使用事件冒泡
        // this.triggerEvent('changeRadio', { value }, { bubbles: true })

        // 发布-订阅模式实现
        // event.emit('radio', value)
      } else {
        // 单独使用的情况
        // 如果自动自动选中
        if (autoCheck) {
          this.setData({ checked: true })
        }
        this.triggerEvent('change', { value, checked: true })
      }
    }
  }
})
