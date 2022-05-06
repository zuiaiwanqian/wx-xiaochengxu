Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 单选一个
    radioChecked: false,
    value: '',
    // 单选组
    radioValue: '',
    // 多选单个
    checkboxChecked: false,
    // 多选组
    checkboxValue: [],
    singleCheckboxValue: '',
    singleCheckboxChecked: false
  },
  tapRadio (e) {
    let { value, checked } = e.detail
    console.log(e)
    this.setData({ 
      value,
      radioChecked: checked
     })
  },
  changeRadioGroup (e) {
    console.log(e)
    let { value } = e.detail
    this.setData({ radioValue: value })
  },
  tapCheckbox (e) {
    let { value, checked } = e.detail
    this.setData({
      value,
      checkboxChecked: checked
    })
  },
  changeCheckboxGroup (e) {
    let { value, arrayValue, checked } = e.detail
    this.setData({
      checkboxValue: arrayValue,
      singleCheckboxValue: value,
      singleCheckboxChecked: checked,
    })
  }
})