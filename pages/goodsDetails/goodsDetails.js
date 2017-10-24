// pages/goodsDetails/goodsDetails.js
var WxSearch = require('../wxSearch/wxSearch.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category_list: [],
    images:[],
    ImNum:0,
    bookIf:true,
    //扫描条形码传入的值
    bookName:"",
    price:"",  //图片直接传入images 数组中
    //----------------------
    imageURL:[],
    hintTXT: "请输入验证码",
    hintHide: false,
    kong:"",
    codeData:"",
    codeIdData:"",
    codeText:"请选择课程代码",
    codeIdText:"请选择课程编号",
    randomId:'',
    kongzhi:false
  },
  wxSearchFn: function (e) {
    var that = this
    WxSearch.wxSearchAddHisKey(that);
  },
  wxSearchInput: function (e) {
    var that = this
    WxSearch.wxSearchInput(e, that);
    // console.log(that.data.wxSearchData)
  },
  wxSerchFocus: function (e) {
    var that = this
    WxSearch.wxSearchFocus(e, that);
  },
  wxSearchBlur: function (e) {
    var that = this
    // WxSearch.wxSearchBlur(e, that);
  },
  wxSearchKeyTap: function (e) {
    var that = this
    WxSearch.wxSearchKeyTap(e, that);
    wx.showLoading({
      title: '课程编号加载中...',
    })
    wx.getStorage({
      key: 'token',
      success: function (res) {
        wx.request({
          url: app.data.Interface + "/books/getCodeId",
          data: {
            userId: res.data.id,
            token: res.data.token,
            code: that.data.wxSearchData.value
          },
          success: (res2) => {
            if (res2.data.reCode == 201) {
              that.setData({
                codeIdData: res2.data.data,
                codeIdText: "请选择课程编号"
              })
              console.log(res2)
            } else {
              wx.showModal({
                title: '提示',
                content: '数据加载失败',
                showCancel: false,
                success: function (res) {
                }
              })
            }
            wx.hideLoading()
          },
          fail: (err) => {
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: '服务器错误',
              showCancel: false,
              success: function (res) {
              }
            })
          }
        })
      },
    })
  },
  wxSearchDeleteKey: function (e) {
    var that = this
    WxSearch.wxSearchDeleteKey(e, that);
  },
  wxSearchDeleteAll: function (e) {
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function (e) {
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
  },
  bookif:function(){ //是否是教材书籍
    this.setData({
      bookIf:!this.data.bookIf
    })
  },
  PickerChangeCode:function(e){  // 选择课程代码课程代码
    let that = this;
    let index = e.detail.value
    
  },
  PickerChangeCodeId:function(e){  //选择课程编号
    let that = this;
    let index = e.detail.value
    that.setData({
      codeIdText: that.data.codeIdData[index].code
    })
  },
  upPhoto: function () {
    var _this = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let images = _this.data.images;
        let Photo = res.tempFilePaths;
        wx.showLoading({
          title: '图片加载中...',
          mask:true
        })
        Photo.forEach(function (item) {
          wx.uploadFile({
            url: app.data.Interface + "/image/save",
            filePath: item,
            name: 'file',
            success: function (res) {
              res = JSON.parse(res.data);
              images.push(res.data);
              _this.setData({
                images: images
              })
              wx.hideLoading();
            },
            fail: (err) => {
              console.log(err)
              wx.hideLoading();
              wx.showModal({
                title: '警告',
                content: '上传失败，请检查网络环境',
                showCancel: false,
              })
            }
          })
        })
      }
    })
  },
  previewImage: function (e) { //图片预览
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: this.data.images // 需要预览的图片http链接列表
    })
  },
  delImage: function (e) {  //删除图片
    let index = e.currentTarget.dataset.index;
    this.data.images.pop(index);
    this.setData({
      images: this.data.images
    })
  },
  state:function(e){  //星星
    this.setData({
      ImNum: e.currentTarget.dataset.index
    })
  },
  cateTab: function (e) { //类别切换
    var that = this;
    var index = e.currentTarget.dataset.index;
    var num = 0;
    that.data.category_list.forEach(function(item){
      if (item.state){
        num++;
      }
    })
    if (num == 2 && that.data.category_list[index].state != true){
      that.data.category_list[index].state = false;
      wx.showModal({
        title: '提示',
        content: '只能选择两个分类',
        showCancel:false
      })
    }else{
      that.data.category_list[index].state = !that.data.category_list[index].state;
    }
    that.setData({
      category_list: that.data.category_list
    })
    if (that.data.category_list[0].state) {
      this.setData({
        bookIf: true
      })
    } else {
      this.setData({
        bookIf: false
      })
    }
  },
  bindblur:function(e){
    var that = this;
    if (isNaN(e.detail.value)){
      console.log(1)
      wx.showModal({
        title: '提示',
        content: '请输入价格数字',
        showCancel: false,
        success: function (res) {
          if (e.target.dataset.type == 'price') {
            that.setData({
              price: ""
            })
          } else {
            that.setData({
              Orprice: ""
            })
          }
        }
      })
    }
    if (e.detail.value == 0 || e.detail.value > 99999999){
      wx.showModal({
        title: '提示',
        content: '正确的价格：0-99999999',
        showCancel: false,
        success: function (res) {
          if (e.target.dataset.type == 'price'){
            that.setData({
              price:""
            })
          }else{
            that.setData({
              Orprice: ""
            })
          }
        }
      })
    }
    return false;
  },
  submit: function (e) {  //提交商品信息
    var formData = e.detail.value;
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function(res) {
        let bookTypeIds = [];
        that.data.category_list.forEach(function (item) {
          if (item.state) {
            bookTypeIds.push(item.id)
          }
        });
        let addBooks = {
          userId: res.data.id,  //用户id
          token: res.data.token,   //用户token
          name: formData.shopName,  //书籍名称
          describes: formData.desc,   //描述
          oldandnew: that.data.ImNum,      //新旧程度
          price: formData.price,         //购买价格
          bookTypes: "sell",   //发布 or 求购
          imgsIds: that.data.images,         //图片
          bookTypeIds: bookTypeIds.join(",")     //类别
        }
        if (that.data.randomId != ''){   //生成一个随机ID 为 唯一标识
          addBooks.randomId = that.data.randomId;
          var addBooksG = true;
        }else{
          var randomId = Math.random() * 999
          console.log(parseInt(randomId))
          addBooks.randomId = parseInt(randomId);
        }
        if (formData.Orprice != ""){
          addBooks.originalPrice = formData.Orprice //原价
        }
        // console.log(formData)
        // if (parseInt(formData.Orprice) < parseInt(formData.price)) {
        //     wx.showModal({
        //       title: '提示',
        //       content: '您的商品价格高于原价，请确认您的定价。',
        //       showCancel: false,
        //       success: function (res) {
        //       }
        //     })
        //     return false;
        // }
        if (that.data.bookIf) {
          if (that.data.codeData.indexOf(that.data.wxSearchData.value) != -1){
            addBooks.courseSeriesCode = that.data.wxSearchData.value; // 课程代码
          }else{
            wx.showModal({
              title: '提示',
              content: '请选择正确的课程代码',
              showCancel: false,
              success: function (res) {
              }
            })
            return false;
          }
          addBooks.courseId = that.data.codeIdText        //课程编号
        }
        var hintTXT = "";
        function isNull(str) {
          if (str == "") return true;
          var regu = "^[ ]+$";
          var re = new RegExp(regu);
          return re.test(str);
        }
        if (addBooks.name.replace(/(^s*)|(s*$)/g, "").length == 0 || addBooks.name.length == 0 || isNull(addBooks.name)) {
          hintTXT = "请输入商品名称";
          that.setData({
            bookName:""
          })
        } else if (addBooks.bookTypeIds == "") {
          hintTXT = "请选择分类"
        } else if (that.data.bookIf) {
          if (addBooks.courseSeriesCode == "" || addBooks.courseSeriesCode == undefined) {
            hintTXT = "请选择课程代码"
          } else if (addBooks.courseId == "" || addBooks.courseId == "请选择课程编号") {
            hintTXT = "请选择课程编号"
          } else if (addBooks.describes.replace(/(^s*)|(s*$)/g, "").length == 0 || addBooks.describes.length == 0 || isNull(addBooks.describes)) {
            hintTXT = "请输入描述";
            that.setData({
              desc:""
            })
          } else if (addBooks.price == "") {
            hintTXT = "请选择价格"
          } else if (addBooks.oldandnew == "") {
            hintTXT = "请输入新旧程度"
          } else if (that.data.images == "") {
            hintTXT = "请选择图片"
          }
        } else if (addBooks.describes.replace(/(^s*)|(s*$)/g, "").length == 0 || addBooks.describes.length == 0 || isNull(addBooks.describes)) {
          hintTXT = "请输入描述";
          that.setData({
            desc: ""
          })
        } else if (addBooks.price == "") {
          hintTXT = "请输入价格"
        } else if (addBooks.oldandnew == "") {
          hintTXT = "请输入新旧程度"
        } else if (that.data.images == "") {
          hintTXT = "请选择图片"
        }
        if (hintTXT != "") {
          wx.showModal({
            title: '提示',
            content: hintTXT,
            showCancel: false,
          })
        } else {
          if (addBooksG){
            wx.setStorage({
              key: 'addBooksG',
              data: addBooks,
            })
          }else{
            wx.getStorage({
              key: 'addBooks',
              success: function (res) {
                var dataArr = []
                dataArr.push(addBooks)
                res.data.forEach(function (item) {
                  dataArr.push(item)
                })
                wx.setStorage({
                  key: 'addBooks',
                  data: dataArr,
                })
              },
              fail: (err) => {  //addBooks 不存在
                wx.setStorage({
                  key: 'addBooks',
                  data: [addBooks],
                })
              }
            })
          }
          if (e.detail.target.dataset.to == 'next') {  //发布多件  返回上一页 再次填写发布商品
            wx.navigateBack({
              delta: 0
            });
          }else{
            that.data.category_list.forEach(function(item,index){
              if(index != 0){
                item.state = false
              }
            })
            that.setData({
              kong:"",
              bookName:"",
              price:"",
              ImNum:0,
              images:[],
              category_list:that.data.category_list,
              bookIf:false,
              desc:'',
              price:'',
              Orprice:''
            })
            wx.navigateTo({
              url: '/pages/confirm/confirm'
            })
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.showLoading({
      title: '数据加载中...',
    })
    wx.request({   //获取商品分类
      url: app.data.Interface + "/index/getType",
      data:{
        isAll:1
      },
      success: (res) => {
        if (res.statusCode == 200){
          res.data.data.forEach(function (item, index) {   //分类，加入状态变量
            _this.data.category_list.push(item)
            _this.data.category_list[index].state = false;
            _this.data.category_list[0].state = true;
          })
          _this.setData({
            category_list: _this.data.category_list
          })
        }else{
          wx.showModal({
            title: '警告',
            content: '数据加载失败，请检查网络状况',
            showCancel: false,
            success:(res2) => {
              if (res2.confirm) {
                wx.reLaunch({
                  url: '/pages/index/index',
                })
              }
            }
          })
        }
      }
    })

    wx.getStorage({  //加载课程代码
      key: 'token',
      success: function(res) {
        wx.request({
          url: app.data.Interface + "/books/getCode",
          data: {
            userId:res.data.id,
            token:res.data.token,
          },
          success: (res2) =>{
            if (res2.data.reCode == 201){
              
              // //初始化的时候渲染wxSearchdata 第二个为你的search高度
              // //热门搜索关键词
              WxSearch.init(_this, 43, [],false,false);
              //搜索的数据
              var codeArr = []
              res2.data.data.forEach(function(item){
                codeArr.push(item.code)
              })
              _this.data.wxSearchData.mindKeys = codeArr
              _this.setData({
                codeData: codeArr,
                wxSearchData: _this.data.wxSearchData
              })
              WxSearch.initMindKeys(codeArr); 
              wx.hideLoading()
            }else{
              wx.showModal({
                title: '提示',
                content: '数据加载失败',
                showCancel: false,
                success: function (res) {
                }
              })
            }
          },
          fail: (err) =>{
            wx.showModal({
              title: '提示',
              content: '服务器错误',
              showCancel: false,
              success: function (res) {
              }
            })
          }
        })
      },
    })
    let images = _this.data.images;  //先选择图片 或者 拍照
    let Photo = options.images;
    if (Photo){
      Photo = Photo.split(',');
      wx.showLoading({
        title: '图片加载中...',
        mask:true
      })
      Photo.forEach(function (item) {
          wx.uploadFile({
              url: app.data.Interface + "/image/save",
              filePath: item,
              name: 'file',
              success: function (res) {
                res = JSON.parse(res.data);
                images.push(res.data);
                _this.setData({
                  images: images
                })
                wx.hideLoading();
              },
              fail: (err) => {
                console.log(err)
                wx.hideLoading();
                wx.showModal({
                  title: '警告',
                  content: '上传失败，请检查网络环境',
                  showCancel: false,
                })
              }
            })
      })
    } 
    let bookData = options.bookData;
      //扫码进入
      if(bookData){
        wx.showLoading({
          title: '图片加载中...',
        })
        bookData = JSON.parse(bookData);
        // console.log(bookData)
        if (bookData.image != ""){
          _this.data.images.push(bookData.image)
          _this.setData({
            images: _this.data.images
          })
        }
        _this.setData({
          bookName: bookData.bookName,
          Orprice: parseInt(bookData.price),
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
    var _this = this;
    if(_this.data.kongzhi){
      if (_this.data.randomId != '') {
        wx.getStorage({
          key: 'addBooks',
          success: function (res) {
            res.data.forEach(function (item) {
              if (item.randomId == _this.data.randomId) {
                var bookTypeIds = item.bookTypeIds.split(',');
                _this.data.category_list.forEach(function (item2) {
                  bookTypeIds.forEach(function (item3) {
                    if (item2.id == item3) {
                      item2.state = true;
                    }
                  })
                })
                if (item.courseSeriesCode != undefined) {
                  _this.setData({
                    bookIf: true
                  })
                  _this.data.wxSearchData.value = item.courseSeriesCode
                } else {
                  _this.setData({
                    bookIf: false
                  })
                }
                _this.setData({
                  bookName: item.name,
                  category_list: _this.data.category_list,
                  desc: item.describes,
                  price: item.price,
                  Orprice: item.originalPrice,
                  ImNum: item.oldandnew,
                  images: item.imgsIds,
                  wxSearchData: _this.data.wxSearchData,
                  kongzhi: false
                })
                console.log(5555)
                console.log(_this.data.images)
              }
            })
          },
        })
      }
    }
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