// pages/zhuye/zhuye.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    img:"",
    jia:"",
    jianrong:"",
    beijing:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
    that.setData({
      name: options.name,
      img: options.img
    })
  },
  fan: function() {
    wx.navigateBack({

    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    var uid = wx.getStorageSync('id');
    wx.request({
      url: getApp().globalData.url + "/index.php/api/Index/onclick_head",
      data: {
        uid: uid
      },
      success: res => {
        that.setData({
          jia: res.data
        })
      }
    })
    // 背景图
    wx.request({
      url: getApp().globalData.url + "/index.php/api/Index/get_beijing",
      success: res => {
        that.setData({
          beijing: res.data.data[1].img
        })
      }
    })
  },
  tiao: function (e) {
    wx.navigateTo({
      url: '/pages/details/details?goodid=' + e.currentTarget.dataset.goodid
    })
  },
  guanzhu: function (e) {
    var that = this;
    var uid = wx.getStorageSync('id');
    // 关注
    wx.request({
      url: getApp().globalData.url + "/index.php/api/Index/is_follow",
      data: {
        uid: uid,
        is_follow_uid: e.currentTarget.dataset.flowwid
      },
      success: res => {
        if (res.data.status == 200) {
          wx.showToast({
            title: res.data.data,
            icon: "none"
          })
          that.onShow();
        }

      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})