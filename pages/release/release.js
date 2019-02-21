// pages/release/release.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: "",
    longitude: "",
    img: "",
    index: "",
    miaoshu: "",
    price: "",
    tranNum: "",
    wupin: "",
    phone: "",
    vals: "发送验证码",
    times: 60,
    returnClick: true,
    yanzheng: "",
    wxnum: "",
    name: [],
    pro_id: 0,
    tempFilePaths: [],
    upload_img: [],
    poster_src: [],
    jianrong: "",
    oneid: "",
    class_id: "",
    release: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
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
      img: options.img,
      index: Number(options.index) + 1,
      miaoshu: options.miaoshu,
      price: options.price,
      tranNum: options.tranNum,
      wupin: options.wupin,
      oneid: options.oneid,
      class_id: options.class_id
    })
  },
  fan: function() {
    wx.navigateBack({

    })
  },
  phone: function(e) {
    var that = this;
    that.setData({
      phone: e.detail.value
    })
  },
  yanzheng: function(e) {
    var that = this;
    that.setData({
      yanzheng: e.detail.value
    })
  },
  wxnum: function(e) {
    var that = this;
    that.setData({
      wxnum: e.detail.value
    })
  },
  mima: function(e) {
    var that = this
    if (that.data.phone == undefined) {
      wx.showToast({
        title: '请先输入手机号',
        icon: "none"
      })
      return false
    }
    if (that.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: "none"
      })
      return false
    }
    var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    if (!myreg.test(that.data.phone)) {
      wx.showToast({
        title: '手机号格式不对',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if (that.data.returnClick == false) {
      return false
    }
    that.setData({
      returnClick: false
    })

    wx.request({
      url: getApp().globalData.url + "/index.php/api/Index/message_new",
      data: {
        mobile: that.data.phone
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        if (res.data.status == 200) {
          wx.showToast({
            title: '验证码已发送,请在30分钟内填写',
            icon: "none"
          })
          var interva = setInterval(function() {
            that.setData({
              vals: --that.data.times + "s"
            })
          }, 1000)

          setTimeout(function() {
            clearInterval(interva)
            that.setData({
              vals: "发送验证码",
              times: 60,
              returnClick: true
            })
          }, 59000)
        }
      }
    })
  },
  //图片上传
  up_img: function() {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          tempFilePaths: res.tempFilePaths
        })
        var successUp = 0; //成功个数
        var failUp = 0; //失败个数
        var length = res.tempFilePaths.length; //总共个数
        var i = 0; //第几个
        that.upload(res.tempFilePaths, successUp, failUp, i, length);
      }
    })
  },
  upload: function(filePaths, successUp, failUp, i, length) {
    var that = this;
    wx.uploadFile({
      url: getApp().globalData.url + '/index.php/api/Index/upload_img',
      filePath: filePaths[i],
      name: 'file',
      success: function(res) {
        var res_data = JSON.parse(res.data);
        if (res_data.status == 200) {
          successUp++;

          var arrimg = that.data.poster_src;
          var now_upload_img = that.data.upload_img

          arrimg.push(filePaths[i]);
          now_upload_img.push(res_data.data);
          that.setData({
            poster_src: arrimg,
            upload_img: now_upload_img
          });
        } else {
          wx.showToast({
            // title: res_data.error,
            title: '上传错误',
            icon: 'loading'
          })
        }

      },
      fail: function(e) {
        failUp++;
        wx.showToast({
          title: '请求失败',
          icon: 'loading'
        })
      },
      complete: function() {
        i++;
        if (i == length) {
          wx.showToast({
            title: '总共' + successUp + '张上传成功,' + failUp + '张上传失败！',
            icon: 'loading'
          })
          that.setData({
            chuan: 1
          })
        } else { //递归调用uploadDIY函数
          that.upload(filePaths, successUp, failUp, i, length);
          that.setData({
            chuan: 0
          })
        }
      }
    })
  },
  // 选择省份
  bindPickerChange(e) {
    var that = this;
    this.setData({
      // 省份的id
      pro_id: Number(e.detail.value)
    })
  },

  bindFormSubmit: function(e) {
    var that = this;
    that.setData({
      release: that.data.release+1
    })
    var img2 = this.data.upload_img
    var wx_code = img2.join(',')
    if (that.data.yanzheng == "") {
      wx.showToast({
        title: '验证码不能为空',
        icon: "none"
      })
      return false
    }
    if (that.data.release>2){
      return;
    }
    console.log(that.data.release)
    var uid = wx.getStorageSync('id')

    var that = this;
    wx.request({
      url: getApp().globalData.url + '/index.php/api/Index/fabu',
      data: {
        uid: uid,
        goods_name: that.data.wupin,
        jianjie: that.data.miaoshu,
        img: that.data.img,
        new_old: that.data.index,
        mail: that.data.tranNum,
        price: that.data.price,
        mobile: that.data.phone,
        code: that.data.yanzheng,
        wx_number: that.data.wxnum,
        city_id: that.data.pro_id + 1,
        wx_img: wx_code,
        class_one_id: that.data.oneid,
        class_two_id: that.data.class_id
      },
      success: res => {

        if (res.data.status == 200) {
          wx.showToast({
            title: res.data.data,
            icon: "none"
          })
          setTimeout(function() {
            wx.reLaunch({
              url: '/pages/index/index'
            });
          }, 500)
        } else if (res.data.status == 201) {
          wx.showToast({
            title: res.data.data,
            icon: "none"
          })
          return;
        }
      }
    });


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
    // 发布不能点击多次
    that.setData({
      release: 1
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