// pages/wenzhang/wenzhang.js
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    article_id:"",
    article:{},
    haokan:false,
    goodlooking_number:"",
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
          systemInfo: res
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
      article_id: options.article_id
    })
  },
  fan: function () {
    wx.navigateBack({

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
    wx.request({
      url: getApp().globalData.url + "/index.php/api/Index/article_details",
      data: {
        article_id: that.data.article_id
      },
      success: res => {
        console.log(res)
        that.setData({
          article: res.data.data,
          goodlooking_number: res.data.data.goodlooking_number
        })
        let contents = res.data.data.content
        WxParse.wxParse('contents', 'html', contents, that);
      }
    })
  },
  haokan:function(){
    var that=this;
    var uid = wx.getStorageSync('id');
    wx.request({
      url: getApp().globalData.url + "/index.php/api/Index/is_good_look",
      data: {
        uid:uid,
        article_id: that.data.article_id
      },
      success: res => {
        console.log(res)
        wx.showToast({
          title: res.data.data,
          icon:"none"
        })
        that.setData({
          goodlooking_number: res.data.goodlooking_number
        })
        // that.onShow();
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})