// pages/fabu/fabu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navtab: ["在架", "已下架"],
    currentTab:0,
    zaijia:[],
    xiajia:[],
    totalpage1:1,
    totalpage2: 1,
    total1:"",
    total2: "",
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
  tiao: function (e) {
    wx.navigateTo({
      url: '/pages/details/details?goodid=' + e.currentTarget.dataset.goodid
    })
  },
  swichNav: function (e) {
    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
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
    var that = this
    that.setData({
      totalpage1:1,
      totalpage2: 1
    })
    var uid = wx.getStorageSync('id')
    wx.request({
      url: getApp().globalData.url + "/index.php/api/Index/my_fabu",
      data:{
        uid:uid,
        type:1
      },
      success: res => {
        that.setData({
          zaijia: res.data.data,
          total1: res.data.totalpage
        })
      }
    })
    wx.request({
      url: getApp().globalData.url + "/index.php/api/Index/my_fabu",
      data: {
        uid: uid,
        type: 2
      },
      success: res => {
        that.setData({
          xiajia: res.data.data,
          total2: res.data.totalpage
        })
      }
    })
  },
  // 下架
  xiajia:function(e){
    var that = this
    var uid = wx.getStorageSync('id')
    wx.request({
      url: getApp().globalData.url + "/index.php/api/Index/xiajia",
      data: {
        uid: uid,
        goods_id: e.currentTarget.dataset.goodid
      },
      success: res => {
        wx.showToast({
          title: res.data.data,
          icon: "none"
        })
        that.onShow()
      }
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
    
    var uid = wx.getStorageSync('id');
    
    if (that.data.currentTab==0){
      if (that.data.totalpage1 >= that.data.total1) {
        that.setData({
          totalpage1: that.data.total1
        })
        // 隐藏加载框
        wx.hideLoading();
        return;
      }
      wx.request({
        url: getApp().globalData.url + "/index.php/api/Index/my_fabu",
        data: {
          uid: uid,
          type: 1,
          page: that.data.totalpage1
        },
        success: res => {
          if (res.data.status == 200) {
            var moment_list = that.data.zaijia;
            for (var i = 0; i < res.data.data.length; i++) {
              moment_list.push(res.data.data[i]);
            }
            // 设置数据
            that.setData({
              zaijia: moment_list
            })
          } else {
            wx: wx.showToast({
              title: res.data.data,
              icon: 'none'
            })
          }
        }
      })
    } else if (that.data.currentTab == 1) {
      if (that.data.totalpage2 >= that.data.total2) {
        that.setData({
          totalpage2: that.data.total2
        })
        // 隐藏加载框
        wx.hideLoading();
        return;
      }
      wx.request({
        url: getApp().globalData.url + "/index.php/api/Index/my_fabu",
        data: {
          uid: uid,
          type: 2,
          page: that.data.totalpage2
        },
        success: res => {
          if (res.data.status == 200) {
            var moment = that.data.xiajia;
            for (var i = 0; i < res.data.data.length; i++) {
              moment.push(res.data.data[i]);
            }
            // 设置数据
            that.setData({
              xiajia: moment
            })
          } else {
            wx: wx.showToast({
              title: res.data.data,
              icon: 'none'
            })
          }
        }
      })
    }
    

    // 隐藏加载框
    wx.hideLoading();
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    var uid = wx.getStorageSync('id')
    if (that.data.currentTab == 0) {
      wx.request({
        url: getApp().globalData.url + "/index.php/api/Index/my_fabu",
        data: {
          uid: uid,
          type: 1
        },
        success: res => {
          that.setData({
            zaijia: res.data.data,
            total1: res.data.totalpage
          })
        }
      })
    } else if (that.data.currentTab == 1) {
      wx.request({
        url: getApp().globalData.url + "/index.php/api/Index/my_fabu",
        data: {
          uid: uid,
          type: 2
        },
        success: res => {
          that.setData({
            xiajia: res.data.data,
            total2: res.data.totalpage
          })
        }
      })
    }
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