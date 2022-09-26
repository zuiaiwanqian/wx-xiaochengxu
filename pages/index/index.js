import { getBackgroundAudioManager, Throttler } from '../../utils/util.js'
Page({
    data: {
        list: [{
                name: 'radio,checkbox组件',
                icon: '🚓',
                type: 'radio'
            },
            {
                name: '播放音乐组件',
                icon: '🚙',
                type: 'audio'
            },
            {
                name: '文字跑马灯组件',
                icon: '🚌',
                type: 'text'
            },
            {
                name: 'vr全景图效果',
                icon: '🛺',
                type: 'vr'
            },
            {
                name: '获取网络状态',
                icon: '🚑',
                type: 'network'
            },
            {
                name: '弹幕滚动效果',
                icon: '🚎',
                type: 'bullet'
            },
            {
                name: 'echarts地图',
                icon: '🚜',
                type: 'chart'
            },
        ]
    },
    onLoad() {},
    bindNav(e) {
        const {
            type
        } = e.currentTarget.dataset
        let url = ''
        switch (type) {
            case 'radio':
                url = '/pages/radio-checkbox/index'
                break;
            case 'audio':
                url = '/pages/audio/index'
                break;
            case 'text':
                url = '/pages/text/index'
                break;
            case 'vr':
                url = '/pages/vrImg/index'
                break;
            case 'network':
                url = '/pages/network/index'
                break;
            case 'bullet':
                url = '/pages/bullet/index'
                break
            case 'chart':
                url = '/pages/charts/index'
            default:
                break;
        }
        wx.navigateTo({
            url,
        })
    },
})