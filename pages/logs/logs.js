//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: [],
    val: 0,
    array: ['全新', '几乎全新', '成色较新', '成色一般', '成色旧'],
    multiArray: [],//二维数组，长度是多少是几列
    multiIndex: [0, 0],
    tempFilePaths: [],
    tempFile: [],
    // 物品图片
    upload_img: [],
    poster_src: [],
    // 微信图片
    wx_codeimg: [],
    wxwx_code: [],
    // 新旧
    index: 0,
    // 物品
    wupin: "",
    // 描述
    miaoshu: "",
    classification: [],
    classone: [],
    classTwo: [],
    jiaoyi: [
      { name: "自取", id: 1 },
      { name: "邮寄", id: 2 }
    ],
    // 自取
    tranNum: 3,
    // 价格
    price: "",
    classerji: [],
    one_id: 1,
    class_id: '',
    jianrong: "",
    vals: "发送验证码",
    times: 60,
    returnClick: true,
    latitude: "",
    longitude: "",
    name:[],
    pro_id:"",
    phone:'',
    dianhua_new:false,
    weixin_new:false,
    dianok:0,
    weixinok:0
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
  },

  onShow() {
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
    // console.log(that.data.name)
    wx.request({
      url: getApp().globalData.url + "/index.php/api/Index/get_class",
      success: res => {
        that.setData({
          classification: res.data.data
        })
        var class_one = that.data.classification;
        var classArr = that.data.classone
        for (var i = 0; i < class_one.length; i++) {
          classArr.push(class_one[i].name)
        }

        that.setData({
          multiArray: [classArr, []],
          class_one,
          classArr
        })
        var classid = class_one[0].id
        if (classid) {
          that.erji(classid)
        }
      }
    })
  },
  erji: function (classid) {
    if (classid) {
      this.setData({
        teach_id: classid
      })
    }
    var that = this
    wx.request({
      url: getApp().globalData.url + "/index.php/api/Index/get_class_two",
      data: {
        class_one_id: that.data.teach_id
      },
      success: res => {
        that.setData({
          classerji: res.data.data
        })
        var class_two = that.data.classerji
        var classarr2 = []
        for (var i = 0; i < class_two.length; i++) {
          classarr2.push(class_two[i].name)
        }

        var classArr = that.data.classone
        that.setData({
          multiArray: [classArr, classarr2],
          classArr
        })
      }
    })
  },


  bindMultiPickerColumnChange: function (e) {
    //e.detail.column 改变的数组下标列, e.detail.value 改变对应列的值
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    var teach_area_id_session = this.data.teach_id;　　　　// 保持之前的校区id 与新选择的id 做对比，如果改变则重新请求数据
    switch (e.detail.column) {
      case 0:
        var xiaoquList = this.data.class_one;
        var teach_area_id = xiaoquList[e.detail.value]['id'];
        // 一级的选中的id
        this.setData({
          one_id: teach_area_id
        })
        if (teach_area_id_session != teach_area_id) {　　　　// 与之前保持的校区id做对比，如果不一致则重新请求并赋新值
          this.erji(teach_area_id);
        }
        data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },
  bindMultiPickerChange: function (e) {
    var class_key = 0;
    var classList = this.data.classerji;

    var select_key = e.detail.value[1];
    var real_key = select_key;
    if (real_key < class_key) {
      this.setData({
        class_id: 0
      })
    } else {
      this.setData({
        class_id: classList[real_key]['id']　　　　　　// class_id 二级id
      })
    }
    this.setData({
      multiIndex: e.detail.value
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
    var trade = [];
    for (var i = 0; i < jiaoyi.length; i++) {
      if (jiaoyi[i].choose == true) {
        trade.push(jiaoyi[i].id)
      }
    }

    if (trade.length == 2) {
      that.setData({
        tranNum: 0
      })
    } else if (trade.length == 1) {
      if (trade[0] == 1) {
        that.setData({
          tranNum: 1
        })
      } else if (trade[0] == 2) {
        that.setData({
          tranNum: 2
        })
      }
    } else if (trade.length == 0) {
      that.setData({
        tranNum: 3
      })
    }
  },
  fan: function () {
    wx.navigateBack({

    })
  },
  phone: function (e) {
    var that = this;
    that.setData({
      phone: e.detail.value
    })
  },
  dianok:function(){
    var that = this;
    that.setData({
      dianhua_new: false
    })
    if (that.data.phone!=''){
      that.setData({
        dianok: 1
      })
    }
  },
  dianhuashow:function(){
    var that=this;
    that.setData({
      dianhua_new:true
    })
  },
  guandian:function(){
    var that = this;
    that.setData({
      dianhua_new: false,
      weixin_new:false
    })
  },
  yanzheng: function (e) {
    var that = this;
    that.setData({
      yanzheng: e.detail.value
    })
  },
  wxnum: function (e) {
    var that = this;
    that.setData({
      wxnum: e.detail.value
    })
  },
  weixinok: function () {
    var that = this;
    that.setData({
      weixin_new: false
    })
    if (that.data.wxnum != '') {
      that.setData({
        weixinok: 1
      })
    }
  },
  weixinshow: function () {
    var that = this;
    that.setData({
      weixin_new: true
    })
  },
  mima: function (e) {
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
    // var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    var phones = {
      'ar-DZ': /^(\+?213|0)(5|6|7)\d{8}$/,
      'ar-SY': /^(!?(\+?963)|0)?9\d{8}$/,
      'ar-SA': /^(!?(\+?966)|0)?5\d{8}$/,
      'en-US': /^(\+?1)?[2-9]\d{2}[2-9](?!11)\d{6}$/,
      'cs-CZ': /^(\+?420)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/,
      'de-DE': /^(\+?49[ \.\-])?([\(]{1}[0-9]{1,6}[\)])?([0-9 \.\-\/]{3,20})((x|ext|extension)[ ]?[0-9]{1,4})?$/,
      'da-DK': /^(\+?45)?(\d{8})$/,
      'el-GR': /^(\+?30)?(69\d{8})$/,
      'en-AU': /^(\+?61|0)4\d{8}$/,
      'en-GB': /^(\+?44|0)7\d{9}$/,
      'en-HK': /^(\+?852\-?)?[569]\d{3}\-?\d{4}$/,
      'en-IN': /^(\+?91|0)?[789]\d{9}$/,
      'en-NZ': /^(\+?64|0)2\d{7,9}$/,
      'en-ZA': /^(\+?27|0)\d{9}$/,
      'en-ZM': /^(\+?26)?09[567]\d{7}$/,
      'es-ES': /^(\+?34)?(6\d{1}|7[1234])\d{7}$/,
      'fi-FI': /^(\+?358|0)\s?(4(0|1|2|4|5)?|50)\s?(\d\s?){4,8}\d$/,
      'fr-FR': /^(\+?33|0)[67]\d{8}$/,
      'he-IL': /^(\+972|0)([23489]|5[0248]|77)[1-9]\d{6}/,
      'hu-HU': /^(\+?36)(20|30|70)\d{7}$/,
      'it-IT': /^(\+?39)?\s?3\d{2} ?\d{6,7}$/,
      'ja-JP': /^(\+?81|0)\d{1,4}[ \-]?\d{1,4}[ \-]?\d{4}$/,
      'ms-MY': /^(\+?6?01){1}(([145]{1}(\-|\s)?\d{7,8})|([236789]{1}(\s|\-)?\d{7}))$/,
      'nb-NO': /^(\+?47)?[49]\d{7}$/,
      'nl-BE': /^(\+?32|0)4?\d{8}$/,
      'nn-NO': /^(\+?47)?[49]\d{7}$/,
      'pl-PL': /^(\+?48)? ?[5-8]\d ?\d{3} ?\d{2} ?\d{2}$/,
      'pt-BR': /^(\+?55|0)\-?[1-9]{2}\-?[2-9]{1}\d{3,4}\-?\d{4}$/,
      'pt-PT': /^(\+?351)?9[1236]\d{7}$/,
      'ru-RU': /^(\+?7|8)?9\d{9}$/,
      'sr-RS': /^(\+3816|06)[- \d]{5,9}$/,
      'tr-TR': /^(\+?90|0)?5\d{9}$/,
      'vi-VN': /^(\+?84|0)?((1(2([0-9])|6([2-9])|88|99))|(9((?!5)[0-9])))([0-9]{7})$/,
      'zh-CN': /^(\+?0?86\-?)?1[345789]\d{9}$/,
      'zh-TW': /^(\+?886\-?|0)?9\d{8}$/
    };
    // console.log(phones);
    // return;
    // if (!phones.test(that.data.phone)) {
    //   wx.showToast({
    //     title: '手机号格式不对',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return false
    // }
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
        console.log(res)
        if (res.data.status == 200) {
          wx.showToast({
            title: '验证码已发送,请在30分钟内填写',
            icon: "none"
          })
          var interva = setInterval(function () {
            that.setData({
              vals: --that.data.times + "s"
            })
          }, 1000)

          setTimeout(function () {
            clearInterval(interva)
            that.setData({
              vals: "发送验证码",
              times: 60,
              returnClick: true
            })
          }, 59000)
        }else{
          wx.showToast({
            title: res.data.data,
            icon:'none'
          })
        }
      }
    })
  },
  // 选择省份
  bindPicker(e) {
    var that = this;
    this.setData({
      // 省份的id
      pro_id: Number(e.detail.value)
    })
  },
  val: function (e) {
    var that = this;
    that.setData({
      wupin: e.detail.value
    })
  },
  miaoshu: function (e) {
    var that = this;
    that.setData({
      miaoshu: e.detail.value
    })
  },
  price: function (e) {
    var that = this;
    that.setData({
      price: e.detail.value
    })
  },

  bindPickerChange(e) {
    this.setData({
      index: Number(e.detail.value)
    })
  },

  //图片上传
  up_img: function () {
    var that = this;
    wx.chooseImage({
      count: 4, // 默认9
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
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
  upload: function (filePaths, successUp, failUp, i, length) {
    var that = this;
    wx.uploadFile({
      url: getApp().globalData.url + '/index.php/api/Index/upload_img',
      filePath: filePaths[i],
      name: 'file',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (res) {
        console.log(res);
        console.log(res.data)
        var res_data = JSON.parse(res.data);
        
        if (res_data.status == 200) {
          console.log(11)
          successUp++;

          var arrimg = that.data.poster_src;
          var now_upload_img = that.data.upload_img
          console.log(now_upload_img)
          arrimg.push(filePaths[i]);
          now_upload_img.push(res_data.data);
          that.setData({
            poster_src: arrimg,
            upload_img: now_upload_img
          })
          console.log(that.data.upload_img)
        } else {
          wx.showToast({
            // title: res_data.error,
            title: '上传错误',
            icon: 'loading'
          })
        }
      },
      fail: function (e) {
        failUp++;
        wx.showToast({
          title: '请求失败',
          icon: 'loading'
        })
      },
      complete: function () {
        i++;
        if (i == length) {
          wx.showToast({
            title: '总共' + successUp + '张上传成功,' + failUp + '张上传失败！',
            icon: 'loading'
          })
          that.setData({
            chuan: 1
          })
        }
        else {  //递归调用uploadDIY函数
          that.upload(filePaths, successUp, failUp, i, length);
          that.setData({
            chuan: 0
          })
        }
      }
    })
  },
  //微信图片上传
  wx_img: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          tempFile: res.tempFilePaths
        })
        var successUp = 0; //成功个数
        var failUp = 0; //失败个数
        var length = res.tempFilePaths.length; //总共个数
        var i = 0; //第几个
        that.uploading(res.tempFilePaths, successUp, failUp, i, length);
      }
    })
  },
  uploading: function (filePaths, successUp, failUp, i, length) {
    var that = this;
    wx.uploadFile({
      url: getApp().globalData.url + '/index.php/api/Index/upload_img',
      filePath: filePaths[i],
      name: 'file',
      success: function (res) {
        var res_data = JSON.parse(res.data);
        if (res_data.status == 200) {
          successUp++;

          var arrimg = that.data.wxwx_code;
          var now_upload_img = that.data.wx_codeimg

          arrimg.push(filePaths[i]);
          now_upload_img.push(res_data.data);
          that.setData({
            wxwx_code: arrimg,
            wx_codeimg: now_upload_img
          })
          console.log(that.data.wx_codeimg)
        } else {
          wx.showToast({
            // title: res_data.error,
            title: '上传错误',
            icon: 'loading'
          })
        }

      },
      fail: function (e) {
        failUp++;
        wx.showToast({
          title: '请求失败',
          icon: 'loading'
        })
      },
      complete: function () {
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
  aaa: function () {

    wx.navigateTo({
      url: '/pages/release/release?wupin=' + that.data.wupin + "&miaoshu=" + that.data.miaoshu + "&price=" + that.data.price + "&img=" + b + "&index=" + that.data.index + "&tranNum=" + that.data.tranNum + "&oneid=" + that.data.one_id + "&class_id=" + that.data.class_id
    })
  },
  bindFormSubmit: function (e) {
    var that = this;
    var a = that.data.upload_img
    console.log(a)
    var b = a.join(',')
    if (that.data.wupin.replace(/\s+/g, '') == "") {
      wx.showToast({
        title: '请输入物品名称',
        icon: "none"
      })
      return;
    } else if (that.data.miaoshu.replace(/\s+/g, '') == "") {
      wx.showToast({
        title: '请输入描述',
        icon: "none"
      })
      return;
    } else if (that.data.miaoshu.length < 5) {
      wx.showToast({
        title: '描述最少5个字',
        icon: "none"
      })
      return;
    } else if (a.length < 1) {
      wx.showToast({
        title: '图片至少上传1张',
        icon: "none"
      })
      return;
      // 到第二页要加1
    } else if (that.data.index === "") {
      wx.showToast({
        title: '请选择新旧程度',
        icon: "none"
      })
      return;
    } else if (that.data.class_id == "") {
      wx.showToast({
        title: '请选择分类',
        icon: "none"
      })
      return;
    } else if (that.data.tranNum == 3) {
      wx.showToast({
        title: '请选择邮寄方式',
        icon: "none"
      })
      return;
    } else if (that.data.price.replace(/\s+/g, '') == "") {
      wx.showToast({
        title: '请输入价格',
        icon: "none"
      })
      return;
    }
    that.setData({
      release: that.data.release + 1
    })
    var img2 = this.data.wx_codeimg
    var wx_code = img2.join(',')
    console.log(wx_code)
    if (that.data.yanzheng == "") {
      wx.showToast({
        title: '验证码不能为空',
        icon: "none"
      })
      return false
    }
    if (that.data.release > 2) {
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
        img: b,
        new_old: that.data.index+1,
        mail: that.data.tranNum,
        price: that.data.price,
        mobile: that.data.phone,
        code: that.data.yanzheng,
        wx_number: that.data.wxnum,
        city_id: that.data.pro_id + 1,
        wx_img: wx_code,
        class_one_id: that.data.one_id,
        class_two_id: that.data.class_id
      },
      success: res => {

        if (res.data.status == 200) {
          wx.showToast({
            title: res.data.data,
            icon: "none"
          })
          setTimeout(function () {
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
})
