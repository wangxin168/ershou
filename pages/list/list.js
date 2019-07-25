// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    display: false,
    shaixuan: false,
    bai: 0,
    height: "",
    twolist: [],
    classification: [],
    name: "",
    oneid: "",
    pro_id: "",
    classcon: [],
    twoid: "",
    hotcity: [],
    newoldarr: [{
      name: '全新',
      id: 1
    }, {
      name: '几乎全新',
      id: 2
    }, {
      name: '成色较新',
      id: 3
    }, {
      name: '成色一般',
      id: 4
    }, {
      name: '成色旧',
      id: 5
    }],
    time: [{
      name: '最新',
      id: 1,
      isSeleted: false
    }, {
      name: '三天内',
      id: 2,
      isSeleted: false
    }, {
      name: '七天内',
      id: 3,
      isSeleted: false
    }, {
      name: '两周内',
      id: 4,
      isSeleted: false
    }],
    jiaoyi:[
      {name:"自取",id:1},
      { name: "邮寄",id:2 }
    ],
    // 热门城市字符串
    hotStr: "",
    newStr: "",
    // 填入的城市的名字
    city_name: "",
    // 最低价
    s_price: "",
    // 最高价
    e_price: "",
    // 时间
    timeid: "",
    tranNum:"",
    price:'',
    jianrong:"",
    totalpage: 1,
    total: "",
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
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height: res.windowHeight
        })
      },
    })
    that.setData({
      oneid: options.oneid,
      name: options.name,
      pro_id: options.pro_id
    })
  },
  fan: function() {
    wx.navigateBack({

    })
  },
  tiao: function (e) {
    wx.navigateTo({
      url: '/pages/details/details?goodid=' + e.currentTarget.dataset.goodid
    })
  },
  // 分类
  dianJi: function(e) {
    var that = this;
    that.setData({
      display: !that.data.display,
      shaixuan: false,
      // isScroll: !that.data.isScroll
    })
  },
  // 筛选
  shaixuan: function(e) {
    var that = this;
    that.setData({
      shaixuan: !that.data.shaixuan,
      display: false,
      // isScroll: !that.data.isScroll
    })
  },
  price:function(){
    var that=this;
    if (that.data.price==0){
      that.setData({
        price:1
      })
    } else if(that.data.price == 1){
      that.setData({
        price: 2
      })
    } else if (that.data.price == 2) {
      that.setData({
        price: 0
      })
    }
    that.content();
  },
  wuyong: function(e) {
    var that = this;
    that.setData({
      shaixuan: true
    })
  },
  
  // 选择二级
  xuanze: function(e) {
    var that = this;
    var classification = that.data.classification
    var one = e.currentTarget.dataset.one
    classification[one].choose = !classification[one].choose
    if (classification[one].choose == true) {
      for (let ii in classification) {
        //下标不为 e.currentTarget.dataset.index 全为 false
        if (ii != one) {
          classification[ii].choose = false;
        }
      }
    }
    that.setData({
      bai: 1,
      oneid: e.currentTarget.dataset.oneid,
      name: e.currentTarget.dataset.onename,
      classification: classification,
      twoid:""
    })
    // 二级
    wx.request({
      url: getApp().globalData.url + "/index.php/api/Index/get_class_two",
      data: {
        class_one_id: that.data.oneid
      },
      success: res => {
        that.setData({
          twolist: res.data.data
        })
        if (res.data.status == 201) {
          that.setData({
            twolist: []
          })
        }
      }
    })
    that.content();
  },
  xuanzesan: function(e) {
    var that = this;
    that.setData({
      name: e.currentTarget.dataset.name,
      twoid: e.currentTarget.dataset.twoid,
      display: false,
      shaixuan: false
    })
    that.content();
  },
  jujiao: function(e) {
    var that = this;
    that.setData({
      city_name: e.detail.value
    })
  },
  low: function(e) {
    var that = this;
    that.setData({
      s_price: e.detail.value
    })
  },
  long: function(e) {
    var that = this;
    that.setData({
      e_price: e.detail.value
    })
  },
  content: function() {
    var that = this;
    // 内容
    wx.request({
      url: getApp().globalData.url + "/index.php/api/Index/select_goods_lst",
      data: {
        class_one_id: that.data.oneid,
        class_two_id: that.data.twoid,
        city_ids: that.data.hotStr,
        new_old: that.data.newStr,
        city_name: that.data.city_name,
        s_price: that.data.s_price,
        e_price: that.data.e_price,
        time_type: that.data.timeid,
        mail: that.data.tranNum,
        order_price: that.data.price
      },
      success: res => {
        if(res.data.status==200){
          that.setData({
            classcon: res.data.data,
            total: res.data.totalpage
          })
        }else if (res.data.status == 201) {
          that.setData({
            classcon: []
          })
        }
      }
    })
  },
  // 点击选择时间
  time: function(e) {
    var that = this;
    var data_index = e.currentTarget.dataset.time
    var time = that.data.time;
    time[data_index].isSeleted = !time[data_index].isSeleted
    if (time[data_index].isSeleted == true) {
      for (let ii in time) {
        //下标不为 e.currentTarget.dataset.index 全为 false
        if (ii != data_index) {
          time[ii].isSeleted = false;
        }
      }
    }
    that.setData({
      time: time,
      timeid: time[data_index].id
    })
  },
  // 点击热门城市
  hotcity: function(e) {
    console.log(e)
    var hotCityData = this.data.hotcity
    var that = this;
    // 下标
    var idx = e.currentTarget.dataset.idx
    // 反选  加属性 是否为true*******
    hotCityData[idx].selects = !hotCityData[idx].selects
    // 重新赋值  根据新添加的true给class名
    that.setData({
      hotcity: hotCityData
    })
  },
  // 点击新旧程度
  newold: function(e) {
    var newoldData = this.data.newoldarr
    var that = this;
    var nwo = e.currentTarget.dataset.nwo
    newoldData[nwo].choose = !newoldData[nwo].choose
    that.setData({
      newoldarr: newoldData
    })
  },
  // 交易方式
  transaction: function (e) {
    var jiaoyi = this.data.jiaoyi
    var that = this;
    var tran = e.currentTarget.dataset.tran
    
    jiaoyi[tran].choose = !jiaoyi[tran].choose
    that.setData({
      jiaoyi: jiaoyi
    })
  },
  // 点击重置
  chongzhi:function(){
    var that=this;
    // 清除交易
    var allDatas = that.data.jiaoyi
    for (let i = 0; i < 2; i++) {
      allDatas[i].choose = false
    }
    // 清除时间
    var time = that.data.time;
    for (let i = 0; i < time.length; i++) {
      time[i].isSeleted = false
    }
    // 清除新旧程度
    var newoldData = this.data.newoldarr
    for (let i = 0; i < newoldData.length; i++) {
      newoldData[i].choose = false
    }
    var hotCityData = this.data.hotcity
    for (let i = 0; i < hotCityData.length; i++) {
      hotCityData[i].selects = false
    }
    that.setData({
      hotStr:"",
      newStr: "",
      city_name: "",
      s_price: "",
      e_price: "",
      timeid: "",
      tranNum: "",
      jiaoyi: allDatas,
      time: time,
      newoldarr: newoldData,
      hotcity: hotCityData
    })
  },
  // 点击确定
  queding: function() {
    var that = this;
    // 点击确定时循环城市为true的放到数组里并转换为字符串
    var hotCityData = this.data.hotcity
    var hot = [];
    for (var i = 0; i < hotCityData.length; i++) {
      if (hotCityData[i].selects == true) {
        hot.push(hotCityData[i].id)
      }
    }
    // 数组转字符串
    var hot2 = hot.join(',');

    // 点击确定时循环新旧程度为true的放到数组里并转换为字符串
    var newoldData = this.data.newoldarr
    var newold = [];
    for (var i = 0; i < newoldData.length; i++) {
      if (newoldData[i].choose == true) {
        newold.push(newoldData[i].id)
      }
    }
    var newold2 = newold.join(',');

    // 点击确定时循环新旧程度为true的放到数组里并转换为字符串
    var jiaoyi = this.data.jiaoyi
    var trade = [];
    for (var i = 0; i < jiaoyi.length; i++) {
      if (jiaoyi[i].choose == true) {
        trade.push(jiaoyi[i].id)
      }
    }
    if (trade.length==2){
      that.setData({
        tranNum:3
      })
    } else if (trade.length == 1){
      if (trade[0]==1){
        that.setData({
          tranNum: 1
        })
      } else if (trade[0] == 2) {
        that.setData({
          tranNum: 2
        })
      }
    }
    that.setData({
      hotStr: hot2,
      newStr: newold2,
      display: false,
      shaixuan: false,
      totalpage: 1
    })
    that.content()
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
    that.setData({
      totalpage: 1
    })
    // 一级
    // 分类
    wx.request({
      url: getApp().globalData.url + "/index.php/api/Index/get_class",
      success: res => {
        that.setData({
          classification: res.data.data
        })
      }
    })
    // 内容
    that.content();
    // 根据省选择市
    wx.request({
      url: getApp().globalData.url + "/index.php/api/Index/get_city",
      success: res => {
        console.log(res)
        that.setData({
          hotcity: res.data.data
        })
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

  onReachBottom: function () {
    var that = this;
    console.log(that.data.totalpage)
    console.log(that.data.total)
    if (that.data.totalpage > that.data.total) {
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
      url: getApp().globalData.url + "/index.php/api/Index/select_goods_lst",
      data: {
        class_one_id: that.data.oneid,
        class_two_id: that.data.twoid,
        city_ids: that.data.hotStr,
        new_old: that.data.newStr,
        city_name: that.data.city_name,
        s_price: that.data.s_price,
        e_price: that.data.e_price,
        time_type: that.data.timeid,
        mail: that.data.tranNum,
        order_price: that.data.price,
        page: that.data.totalpage
      },
      success: res => {
        
          // that.setData({
          //   totalpage: 1
          // })
        
        if (res.data.status == 200) {
          
          var moment_list = that.data.classcon;
          for (var i = 0; i < res.data.data.length; i++) {
            moment_list.push(res.data.data[i]);
          }
          // if (that.data.totalpage == that.data.total) {
          //   return;
          // }
          // 设置数据
          that.setData({
            classcon: moment_list
          })
          // console.log(that.data.totalpage)
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that = this;
  }
})