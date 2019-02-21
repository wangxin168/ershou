var app = getApp()
Page({
  data: {
    categroy: 1,
    seen: false,
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    name: [],
    // top标签显示（默认不显示）
    backTopValue: false,
    index: "",
    latitude: "",
    longitude: "",
    classification: [],
    newlist: [],
    pro_id: 1,
    shouye: true,
    wode: false,
    beijing: "",
    chufa: "",
    totalpage: 1,
    total:"",
    jianrong:""
  },
  tiao: function (e) {
    wx.navigateTo({
      url: '/pages/details/details?goodid=' + e.currentTarget.dataset.goodid
    })
  },
  yi: function (e) {
    var that = this;
    that.setData({
      categroy: e.currentTarget.dataset.idx,
      shouye: true,
      wode: false
    })
    if (e.currentTarget.dataset.idx == 1) {
      that.setData({
        shouye: true,
        wode: false
      })
    } else {
      that.setData({
        shouye: false,
        wode: true
      })
    }
  },
  er: function (e) {
    var that = this;
    that.setData({
      seen: true

    })
    wx.navigateTo({
      url: '/pages/logs/logs'
    })
  },
  // input完成时
  chufa: function (e) {
    var that = this;
    that.setData({
      chufa: e.detail.value
    })
    that.pro();
  },
  onLoad: function () {
    if (wx.getStorageSync('openid') == "") {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          systemInfo: res,
        })
        if (res.platform == "ios") {
          that.setData({
            jianrong:0
          })
        } else if (res.platform == "android") {
          that.setData({
            jianrong: 1
          })
        }
      }
    })
  },
  onShow: function () {
    var that = this;
    that.setData({
      seen: false,
      totalpage:1
    })

    // 左上角选择省
    wx.request({
      url: getApp().globalData.url + "/index.php/api/Index/get_city",
      success: res => {
        that.setData({
          province: res.data.data
        })
        var name = []
        for (var i = 0; i < that.data.province.length; i++) {
          name.push(that.data.province[i].name)
        }
        that.setData({
          name: name
        })
      }
    })
    // 轮播
    wx.request({
      url: getApp().globalData.url + "/index.php/api/Index/lunbotu",
      success: res => {
        that.setData({
          imgUrls: res.data.data
        })
      }
    })
    // 分类
    wx.request({
      url: getApp().globalData.url + "/index.php/api/Index/get_class",
      success: res => {
        that.setData({
          classification: res.data.data
        })
      }
    })
    // 最新的列表
    that.pro()
    // 背景图
    wx.request({
      url: getApp().globalData.url + "/index.php/api/Index/get_beijing",
      success: res => {
        that.setData({
          beijing: res.data.data[0].img
        })
      }
    })
  },
  // 点击轮播图片跳转
  new_detail: function (e) {
    if (e.currentTarget.dataset.type_id == 1) {
      wx.navigateTo({
        url: '/pages/wenzhang/wenzhang?article_id=' + e.currentTarget.dataset.article_id
      })
    } else if (e.currentTarget.dataset.type_id == 2) {
      wx.navigateTo({
        url: '/pages/guanyu/guanyu'
      })
    }
  },
  // 最新的列表
  pro: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.url + "/index.php/api/Index/goods_lst",
      data: {
        city_id: that.data.pro_id,
        goods_name: that.data.chufa
      },
      success: res => {
        console.log(res)
        if(res.data.status==200){
          that.setData({
            newlist: res.data.data,
            total: res.data.totalpage
          })
        }else if (res.data.status == 201) {
          that.setData({
            newlist: []
          })
        }
      }
    })
  },
  // 选择省份
  bindPickerChange(e) {
    var that = this;
    this.setData({
      // 省份的下标
      index: e.detail.value,
      // 省份的id
      pro_id: Number(e.detail.value) + 1
    })
    // 最新的列表
    that.pro()
  },
  // 点击最新的
  new_new: function () {
    var that = this;
    // 最新的列表
    that.pro()
  },
  xiaoxi: function () {
    wx.navigateTo({
      url: '/pages/xiaoxi/xiaoxi'
    })
  },
  fabu: function () {
    wx.navigateTo({
      url: '/pages/fabu/fabu'
    })
  },
  shoucang: function () {
    wx.navigateTo({
      url: '/pages/shoucang/shoucang'
    })
  },
  guanzhu: function () {
    wx.navigateTo({
      url: '/pages/guanzhu/guanzhu'
    })
  },
  guanyu: function () {
    wx.navigateTo({
      url: '/pages/guanyu/guanyu'
    })
  },
  list: function (e) {
    var that = this;
    wx.navigateTo({
      url: '/pages/list/list?oneid=' + e.currentTarget.dataset.oneid + '&name=' + e.currentTarget.dataset.name + '&pro_id=' + that.data.pro_id
    })
  },
  zhuye: function (e) {
    wx.navigateTo({
      url: '/pages/zhuye/zhuye?name=' + e.currentTarget.dataset.name + '&img=' + e.currentTarget.dataset.img
    })
  },
  // 监听滚动条坐标
  onPageScroll: function (e) {
    var that = this
    var scrollTop = e.scrollTop
    var backTopValue = scrollTop > 500 ? true : false
    that.setData({
      backTopValue: backTopValue
    })
  },

  // 滚动到顶部
  backTop: function () {
    // 控制滚动
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  wode: function () {
    var that = this;
    var uid = wx.getStorageSync('id');
    wx.request({
      url: getApp().globalData.url + "/index.php/api/Index/onclink_my",
      data: {
        uid: uid
      },
      success: res => {
        that.setData({
          xinxi: res.data.data
        })
      }
    })
  },
  onReachBottom: function () {
    var that = this;
    if (that.data.totalpage >= that.data.total){
      that.setData({
        totalpage: that.data.total
      })
      // 隐藏加载框
      wx.hideLoading();
      return;
    }
    // 页数+1
    that.setData({
      totalpage: that.data.totalpage + 1
    })
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    wx.request({
      url: getApp().globalData.url + "/index.php/api/Index/goods_lst",
      data: {
        city_id: that.data.pro_id,
        goods_name: that.data.chufa,
        page: that.data.totalpage
      },
      success: res => {
        if (res.data.status == 200) {
          var moment_list = that.data.newlist;
          for (var i = 0; i < res.data.data.length; i++) {
            moment_list.push(res.data.data[i]);
          }
          // 设置数据
          that.setData({
            newlist: moment_list
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
    var that=this;
    that.pro();
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
    that.setData({
      totalpage: 1
    })
  }
})