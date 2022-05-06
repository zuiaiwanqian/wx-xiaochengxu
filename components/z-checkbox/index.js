// components/z-data-checkbox.js
Component({
  /**
   * 组件的属性列表
   */
  externalClasses: ['my-class'],
  properties: {
    // 是否自动选中
    autoCheck: {
      type: Boolean,
      value: false,
    },
    // 是否为特殊值，除自己外全部被清除，再有group时生效
    only: {
      type: Boolean,
      value: false,
    },
    // value值
    value: {
      type: null,
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
      value: 'https://kf-ui.cdn-go.cn/weapp-image/latest/weapp-sndt/images/new/multi_selected.png',
    },
    // 未选中的图片
    noSelectedImg: {
      type: String,
      value: 'https://kf-ui.cdn-go.cn/weapp-image/latest/weapp-sndt/images/multi_normal.png',
    },
    // 禁用的图片
    disabledImg: {
      type: String,
      value: 'https://kf-ui.cdn-go.cn/weapp-image/latest/weapp-sndt/images/multi_disabled.png',
    }
  },
  // 获取与z-checkbox-group的联系
  relations: {
    '../z-checkbox-group/index': {
      type: 'parent', // 关联的目标节点应为父节点
      linked: function (target) {
        // 每次被插入到z-checkbox-group时执行，target是z-checkbox-group节点实例对象，触发在attached生命周期之后
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
    // 点击多选按钮
    tapCheckbox () {
      let { value, checked, parent, disabled, autoCheck, } = this.data
      if (disabled) return
      // 多选框组的情况
      if (parent) {
        // 1.第一种实现方式如果有parent 直接通过relations拿到的实例，在这个组件里面提交一个事件
        // 处理好一个选中的数组
        let checkboxValue = parent.data.value
        let onlyValue = parent.data.onlyValue || null
        // console.log(onlyValue)
        if (checkboxValue.indexOf(value) !== -1) {
          // 取消选中
          let delIndex = 0
          checkboxValue.map((item, index) => {
            if (item === value) {
              delIndex = index
            }
          })
          checkboxValue.splice(delIndex, 1)
        } else {
          // 选中
          checkboxValue = [...checkboxValue, value]
          // 有onlyValue时
          if (onlyValue !== null) {
            // 如果点中的是onlyValue的值
            if (onlyValue === value) {
              checkboxValue = [value]
            } 
            // 如果点中的不是onlyValue的值并且onlyValue在checkboxValue里面时
            if (checkboxValue.indexOf(onlyValue) !== -1 && onlyValue !== value){
              checkboxValue.splice(0, 1)
            }
          }
        }
        // 如果该项多选按钮是only的情况
        // console.log(checkboxValue)
        parent.triggerEvent('onchange', { arrayValue: checkboxValue, value, checked: !checked })

        // 2.使用事件冒泡
        // this.triggerEvent('changeCheckbox', { value }, { bubbles: true })
      } else {
        // 如果自动自动选中
        if (autoCheck) {
          this.setData({ checked: !checked })
        }
        // 单独使用的情况
        this.triggerEvent('change', { value, checked: !checked })
      }
    }
  }
})
