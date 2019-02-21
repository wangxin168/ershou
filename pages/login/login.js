Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    uid: 0,
    jianrong:""
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          systemInfo: res,
        })
        if (res.platform == "ios") {
          that.setData({
            jianrong: 0
          })
        } else if (res.platform == "android") {
          that.setData({
            jianrong: 1
          })
        }
      }
    })
    wx.login({
      success: res => {
        wx.request({
          url: getApp().globalData.url + "/index.php/api/Index/get_openid_api/code/",
          data: {
            code: getApp().globalData.code,
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            if (res.data.status == 200) {
              wx.setStorageSync('id', res.data.data.uid)
              wx.setStorageSync('openid', res.data.data.openid)
              wx.setStorageSync('user_img', res.data.data.img)
              wx.setStorageSync('user_nickname', res.data.data.nickname)
            }
            if (res.data.data.img !=undefined){
              wx.navigateTo({
                url: '/pages/index/index',
              })
            }
          }
        })
      }
    })
  },
  //获取用户信息接口

  bindGetUserInfo: function (e) {
    wx.setStorageSync('user_img', e.detail.userInfo.avatarUrl)
    wx.setStorageSync('user_nickname', e.detail.userInfo.nickName)
    wx.request({
      url: getApp().globalData.url + "/index.php/api/Index/get_info",
      data: {
        uid: wx.getStorageSync('id'),
        nickname: e.detail.userInfo.nickName,
        avatar: e.detail.userInfo.avatarUrl
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if(res.data.status==200){
          wx.navigateTo({
            url: '/pages/index/index',
          })
        }
      }
    })
  },

})
