// pages/guanzhu/guanzhu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    follow:[],
    totalpage:1,
    total:"",
    jianrong:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  },
  fan: function () {
    wx.navigateBack({

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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.setData({
      totalpage: 1
    })
    var uid = wx.getStorageSync('id');
    wx.request({
      url: getApp().globalData.url + "/index.php/api/Index/my_follow",
      data: {
        uid: uid
      },
      success: res => {
        that.setData({
          follow: res.data.data,
          totalpage: res.data.totalpage
        })
      }
    })
  },
  hisye:function(e){
    wx.navigateTo({
      url: '/pages/hiszhuye/hiszhuye?name=' + e.currentTarget.dataset.name + '&img=' + e.currentTarget.dataset.img + '&followid=' + e.currentTarget.dataset.followid
    })
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

  onReachBottom: function () {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    // 页数+1
    that.setData({
      totalpage: that.data.totalpage + 1
    })
    if (that.data.totalpage >= that.data.total) {
      that.setData({
        totalpage: that.data.total
      })
      // 隐藏加载框
      wx.hideLoading();
      return;
    }
    var uid = wx.getStorageSync('id');
    wx.request({
      url: getApp().globalData.url + "/index.php/api/Index/my_follow",
      data: {
        uid: uid,
        page: that.data.totalpage
      },
      success: res => {
        if (res.data.status == 200) {
          var moment_list = that.data.follow;
          for (var i = 0; i < res.data.data.length; i++) {
            moment_list.push(res.data.data[i]);
          }
          // 设置数据
          that.setData({
            follow: moment_list
          })
        } else {
          wx: wx.showToast({
            title: res.data.data,
            icon: 'none'
          })
        }
      }
    })

    // 隐藏加载框
    wx.hideLoading();
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    that.onShow();
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})