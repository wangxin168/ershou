// pages/details/details.js
import CTB from '../../utils/canvas-text-break.js';
import wxp from '../../utils/wxp.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    // 手机号
    phone: "",
    // 微信号
    weixin: "",
    huang: 0,
    huang2: 0,
    goodid: "",
    detail: {},
    imgurl: [],
    mail: "", 
    mailarr: [], 
    newold: "",
    xian: [],
    is_follow_type: "",
    is_shoucang: "",
    jubao: false,
    newoldarr: [{
      name: '发布虚假信息',
      id: 1
    }, {
      name: '产品涉嫌违法',
      id: 2
    }, {
      name: '存在侵权行为',
      id: 3
    }, {
      name: '存在欺诈行为',
      id: 4
    }, {
      name: '其他',
      id: 5
    }],
    newoldarrid: "",
    jubao_value: "",
    list: [],
    jianrong: "",
    // 微信码
    wx_img_code: "",
    wx_img: [],
    display:false,
    beij:false,
    NEW_WIDTH: 750 + 40,
    NEW_HEIGHT: 1148 + 40,
    windowWidth:"",
    windowHeight:"",
    cardCreateImgUrl:"",
    erwei_img:getApp().globalData.url,
    canvas_type:1,
    // erweima
    canvasewm:'',
    goods_name:'',
    price:'',
    img_detail:'',
    div_width:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          systemInfo: res,
          // left:系统宽度减去view宽度除以2
          windowWidth: (res.windowWidth - 320)/2,
          // top:系统高度减去view高度除以2
          windowHeight: (res.windowHeight - 460) / 2
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
      goodid: options.goodid
    })
    that.xuanran();
  },
  fan: function () {
    wx.navigateBack({

    })
  }, 
  xuanran:function(){
    var that=this;
    var uid = wx.getStorageSync('id');
    wx.request({
      url: getApp().globalData.url + "/index.php/api/Index/onclick_goods_details",
      data: {
        uid: uid,
        goods_id: that.data.goodid
      },
      success: res => {
        console.log(res)
        that.setData({
          detail: res.data.data[0],
          imgurl: res.data.data[0].imgsss,
          mail: res.data.data[0].mail,
          newold: res.data.data[0].new_old,
          xian: res.data.xian,
          is_follow_type: res.data.is_follow_type,
          is_shoucang: res.data.data[0].is_shoucang,
          wx_img_code: res.data.data[0].wx_img_code,
          phone: res.data.data[0].mobile,
          weixin: res.data.data[0].wx_number,
          goods_name: res.data.data[0].goods_name,
          price: res.data.data[0].price,
          img_detail: res.data.data[0].imgsss[0],
          width: res.data.data[0].img_info.width,
          height: res.data.data[0].img_info.height
        })
        console.log(that.data.width)
        // 判断自取邮寄
        if (that.data.mail == 0) {
          that.setData({
            mailarr: ['自取', '邮寄']
          })
        } else if (that.data.mail == 1) {
          that.setData({
            mailarr: ['自取']
          })
        } else if (that.data.mail == 2) {
          that.setData({
            mailarr: ['邮寄']
          })
        }
        // 判断新旧
        if (that.data.newold == 1) {
          that.setData({
            newold: '全新'
          })
        } else if (that.data.newold == 2) {
          that.setData({
            newold: '几乎全新'
          })
        } else if (that.data.newold == 11) {
          that.setData({
            newold: '几乎全新'
          })
        } else if (that.data.newold == 3) {
          that.setData({
            newold: '成色较新'
          })
        } else if (that.data.newold == 4) {
          that.setData({
            newold: '成色一般'
          })
        } else if (that.data.newold == 5) {
          that.setData({
            newold: '成色旧'
          })
        }
        var wx_img = that.data.wx_img_code
        var wx_img2 = wx_img.split(',')
        that.setData({
          newold: that.data.newold,
          wx_img: wx_img2
        })

      }
    })
  },
  fenxiang:function(){
    var that=this;
    that.setData({
      display:!that.data.display,
      beij:true
    })
  },
 
  canvasdraw: function () {
    var that = this; 
    wx.showToast({
      title: '图片正在生成保存中',
      icon: 'loading',
      duration: 5000
    });
    that.setData({
      canvas_type: 2
    })
    wx.getImageInfo({
      src: that.data.img_detail,
      success(res) {
        console.log(res)
        that.setData({
          img_detail: res.path
        })
        setTimeout(function () {
          console.log(that.data.img_detail)
        }, 1000)
      }
    })
    wx.getImageInfo({
      src: that.data.canvasewm,
      success(res) {
        console.log(res)
        that.setData({
          canvasewm: res.path
        })
        setTimeout(function () {
          console.log(that.data.canvasewm)
          that.huizhi()
        }, 1000)
      }
    })
  },
  
  huizhi: function () {
    var that = this;
    let ratio = that.data.ratio;
    var canvas = wx.createCanvasContext('canvas');
    var canvasewm = that.data.canvasewm;
    var img_detail = that.data.img_detail;
    var tuijian = that.data.goods_name;
    var price = that.data.price;
    var w = that.data.width
    var h = that.data.height
    var dw = 300 / w          //canvas与图片的宽高比
    var dh = 200 / h
    // that.setData({
    //   div_width: 808 * ratio
    // })
    canvas.setFillStyle('#ffffff');
    canvas.fillRect(0, 0, 375 * ratio, 550 * ratio);

    canvas.setFillStyle('#ffe600');
    canvas.fillRect(0, 320 * ratio, 375 * ratio, 110 * ratio);

    canvas.setFillStyle('#FC6E21') //文字颜色：默认黑色
    canvas.setFontSize(18 * ratio) //设置字体大小，默认10
    canvas.fillText('$'+price, 20 * ratio, 290 * ratio) //绘制文本

    canvas.setFillStyle('#2E2E2E') //文字颜色：默认黑色
    canvas.setFontSize(16 * ratio) //设置字体大小，默认10
    canvas.fillText(tuijian, 20 * ratio, 270 * ratio) //绘制文本

    canvas.setFillStyle('#2E2E2E') //文字颜色：默认黑色
    canvas.setFontSize(14 * ratio) //设置字体大小，默认10
    canvas.fillText('分享个好物', 20 * ratio, 365 * ratio) //绘制文本

    canvas.setFillStyle('#333') //文字颜色：默认黑色
    canvas.setFontSize(14 * ratio) //设置字体大小，默认10
    canvas.fillText('快来看墨尔本~', 20 * ratio, 385 * ratio) //绘制文本

    canvas.setFillStyle('#333') //文字颜色：默认黑色
    canvas.setFontSize(14 * ratio) //设置字体大小，默认10

    canvas.drawImage(canvasewm, 230 * ratio, 330 * ratio, 92 * ratio, 92 * ratio);
    // canvas.drawImage(img_detail, 0 * ratio, 0 * ratio, 344 * ratio, 230 * ratio);
    // 裁剪图片中间部分
    if (w > 300 && h > 200 || w < 300 && h < 200) {
      if (dw > dh) {
        canvas.drawImage(img_detail, 0, (h - 200 / dw) / 2, w, 200 / dw, 0, 0, 344 * ratio, 230 * ratio)
      } else {
        canvas.drawImage(img_detail, (w - 300 / dh) / 2, 0, 300 / dh, h, 0, 0, 344 * ratio, 230 * ratio)
      }
    }
    // canvas.drawImage(img_detail, 0 * ratio, 0 * ratio);
    canvas.draw(true, setTimeout(function () {
      that.save_tp()
    }, 1000));
  },
  save_tp: function () {
    var that=this;
    wx.canvasToTempFilePath({
      canvasId: 'canvas',
      fileType: 'jpg',
      success(res) {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success() {
                wx.showToast({
                  title: '图片保存成功'
                })
                that.setData({
                  beij: false
                })
              }
            })
          }
        })
      }
    }, this)
  },
  guanbi:function(){
    var that = this;
    that.setData({
      display: false,
      beij:false
    })
    that.onShow();
  },
  // 监听滚动条坐标
  onPageScroll: function (e) {
    //console.log(e)
    var that = this
    var scrollTop = e.scrollTop
    var backTopValue = scrollTop > 400 ? true : false
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
  //图片点击事件
  imgYu: function (event) {
    var that= this
    var src = event.currentTarget.dataset.src; //获取data-src
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: that.data.imgurl // 需要预览的图片http链接列表
    })
  },
  // 预览微信码
  previewImage: function (e) {
    var current = '"' + e.target.dataset.src + '"';
    wx.previewImage({
       current: current, // 当前显示图片的http链接  
      urls: this.data.wx_img // 需要预览的图片http链接列表  
    })
  },
  // 一键复制事件
  copyBtn: function (e) {
    var that = this;
    that.setData({
      huang: 1
    })
    wx.setClipboardData({
      //准备复制的数据
      data: that.data.phone,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
        that.setData({
          huang: 0
        })
      }
    });
  },
  // 一键复制事件
  copywei: function (e) {
    var that = this;
    if (that.data.weixin == "" || that.data.weixin == undefined) {
      return;
    }
    that.setData({
      huang2: 1
    })
    wx.setClipboardData({
      //准备复制的数据
      data: that.data.weixin,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
        that.setData({
          huang2: 0
        })
      }
    });
  },
  // 举报
  jubao: function () {
    var that = this;
    this.setData({
      jubao: !this.data.jubao
    })
    // console.log(that.data.jubao)
  },
  liyoutext: function (e) {
    // console.log(e)
    var that = this;
    that.setData({
      jubao_value: e.detail.value
    })
  },
  queding: function (e) {
    var that = this;
    var uid = wx.getStorageSync('id');
    wx.request({
      url: getApp().globalData.url + "/index.php/api/Index/jubao",
      data: {
        uid: uid,
        type: that.data.newoldarrid,
        content: that.data.jubao_value,
        goods_id: e.currentTarget.dataset.jubao_id
      },
      success: res => {
        if (res.data.status == 200) {
          wx.showToast({
            title: res.data.data,
            icon: "none"
          })
          that.setData({
            jubao: false
          })
        }
      }
    })
  },
  // 点击选择liyou
  liyou: function (e) {
    var that = this;
    var data_index = e.currentTarget.dataset.liyou
    var newoldarr = that.data.newoldarr;
    newoldarr[data_index].isSeleted = !newoldarr[data_index].isSeleted
    if (newoldarr[data_index].isSeleted == true) {
      for (let ii in newoldarr) {
        //下标不为 e.currentTarget.dataset.index 全为 false
        if (ii != data_index) {
          newoldarr[ii].isSeleted = false;
        }
      }
    }
    that.setData({
      newoldarr: newoldarr,
      newoldarrid: newoldarr[data_index].id
    })
  },
  zhuye: function (e) {
    wx.navigateTo({
      url: '/pages/hiszhuye/hiszhuye?name=' + e.currentTarget.dataset.name + '&img=' + e.currentTarget.dataset.img + '&followid=' + e.currentTarget.dataset.followid
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
          that.xuanran()
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          ratio: res.screenWidth / 375
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    // 获取小程序码
    wx.request({
      url: getApp().globalData.url + "/index.php/api/Index/share",
      data: {
        goods_id: that.data.goodid,
        page: "pages/details/details",
        width: 280,
        auto_color: false,
        line_color: {
          "r": 0,
          "g": 0,
          "b": 0
        }
      },
      success: res => {
        console.log(res)
        that.setData({
          canvasewm: res.data.data
        })
      }
    })
    
  },
  // 拨打电话
  phoneCall: function (e) {

    wx.makePhoneCall({

      phoneNumber: e.currentTarget.dataset.replyPhone,

      success: function () {

        // console.log("成功拨打电话")

      },

    })

  },
  shouye: function () {
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },
  // 收藏
  shoucang: function (e) {
    var that = this;
    var uid = wx.getStorageSync('id');
    wx.request({
      url: getApp().globalData.url + "/index.php/api/Index/is_collection",
      data: {
        uid: uid,
        goods_id: e.currentTarget.dataset.shouc
      },
      success: res => {
        // console.log(res)
        if (res.data.status == 200) {
          wx.showToast({
            title: res.data.data,
            icon: "none"
          })
          that.xuanran()
        }

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