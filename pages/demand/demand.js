// pages/demand/demand.js
var WxSearch = require('../wxSearch/wxSearch.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images:[],
    category_list: [],
    hintTXT: "请输入验证码",
    hintHide: false,
    codeData: "",
    codeIdData: "",
    codeText: "请选择课程代码",
    codeIdText: "请选择课程编号",
    bookIf: true,
    bookName:"",
    desc:""
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
  bookif: function () { //是否是教材书籍
    this.setData({
      bookIf: !this.data.bookIf
    })
  },
  PickerChangeCode: function (e) {  // 选择课程代码课程代码
    // let that = this;
    // let index = e.detail.value
    // that.setData({
    //   codeText: that.data.codeData[index].code,
    //   codeIdText: "请选择课程编号"
    // })
    // wx.showLoading({
    //   title: '课程编号加载中...',
    // })
    // wx.getStorage({
    //   key: 'token',
    //   success: function (res) {
    //     wx.request({
    //       url: app.data.Interface + "/books/getCodeId",
    //       data: {
    //         userId: res.data.id,
    //         token: res.data.token,
    //         code: that.data.codeData[index].code
    //       },
    //       success: (res2) => {
    //         if (res2.data.reCode == 201) {
    //           that.setData({
    //             codeIdData: res2.data.data,
    //           })
    //         } else {
    //           wx.showModal({
    //             title: '提示',
    //             content: '数据加载失败',
    //             showCancel: false,
    //             success: function (res) {
    //             }
    //           })
    //         }
    //         wx.hideLoading()
    //       },
    //       fail: (err) => {
    //         wx.hideLoading()
    //         wx.showModal({
    //           title: '提示',
    //           content: '服务器错误',
    //           showCancel: false,
    //           success: function (res) {
    //           }
    //         })
    //       }
    //     })
    //   },
    // })
  },
  PickerChangeCodeId: function (e) {  //选择课程编号
    let that = this;
    let index = e.detail.value
    that.setData({
      codeIdText: that.data.codeIdData[index].code
    })
  },
  upPhoto:function(){
    var _this = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let images = _this.data.images;
        let Photo = res.tempFilePaths;
        Photo.forEach(function(item){
          images.push(item) 
        })
        _this.setData({
          images: images
        })
      }
    })
  },
  cateTab: function (e) { //类别切换
    var that = this;
    var index = e.currentTarget.dataset.index;
    var num = 0;
    that.data.category_list.forEach(function (item) {
      if (item.state) {
        num++;
      }
    })
    if (num == 2 && that.data.category_list[index].state != true) {
      that.data.category_list[index].state = false;
      wx.showModal({
        title: '提示',
        content: '只能选择两个分类',
        showCancel: false
      })
    } else {
      that.data.category_list[index].state = !that.data.category_list[index].state;
    }
    if (!that.data.category_list[0].state) {
        that.setData({
          bookIf:false
        })
    }
    that.setData({
      category_list: that.data.category_list
    })
  },
  previewImage:function (e) { //图片预览
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: this.data.images // 需要预览的图片http链接列表
    })
  },
  delImage:function(e){  //删除图片
    let index = e.currentTarget.dataset.index;
    this.data.images.pop(index);
    this.setData({
      images:this.data.images
    })
  },
  submit:function(e){  //表单提交 验证
    let value = e.detail.value;
    function isNull(str) {
      if (str == "") return true;
      var regu = "^[ ]+$";
      var re = new RegExp(regu);
      return re.test(str);
    }
    if (value.name.replace(/(^s*)|(s*$)/g, "").length == 0 || value.name.length == 0 || isNull(value.name)){
      this.setData({
        bookName:""
      })
      wx.showModal({
        content: '请输入商品标题',
        showCancel:false
      });
      return
    }
    if (value.cont.replace(/(^s*)|(s*$)/g, "").length == 0 || value.cont.length == 0 || isNull(value.cont)) {
      this.setData({
        desc:""
      })
      wx.showModal({
        content: '请输入商品描述',
        showCancel: false
      });
      return
    }
    if (this.data.images.length == 0){
      wx.showModal({
        content: '请上传商品图片',
        showCancel: false
      });
      return
    }
    // codeText: "请选择课程代码",
    // codeIdText: "请选择课程编号",
    // bookIf: true,
    console.log(this.data.bookIf)
    if (this.data.bookIf){
      if (this.data.wxSearchData.value == ''){
        wx.showModal({
          content: '请选择课程代码',
          showCancel: false
        });
        return
      } else if (this.data.codeData.indexOf(this.data.wxSearchData.value) == -1) {
        wx.showModal({
          content: '请选择正确的课程代码',
          showCancel: false
        });
        return 
      }
      if (this.data.codeIdText == '' || this.data.codeIdText == '请选择课程编号') {
        wx.showModal({
          content: '请选择课程编号',
          showCancel: false
        });
        return
      }
    }
    var that = this;
    //上传求购信息
    // console.log(value);
    // console.log(this.data.images);
   wx.getStorage({
     key: 'token',
     success: function(res3) {
       var imageURL = [];
       wx.showLoading({
         title: '正在上传..',
       })
       that.data.images.forEach(function(item){
          wx.uploadFile({
            url: app.data.Interface + "/image/save",
            filePath: item,
            name: 'file',
            success: (res) =>{
              imageURL.push(JSON.parse(res.data).data)
              if (imageURL.length == that.data.images.length) {
                       var category = []
                        that.data.category_list.forEach(function(item){
                          if(item.state){
                            category.push(item.id)
                          }
                        })
                        let obj = {
                          userId: res3.data.id,
                          token: res3.data.token,
                          name: value.name,
                          describes: value.cont,
                          bookTypes: "buy",
                          imgsIds: imageURL.join(","),
                          bookTypeIds: category.join(","),
                        }
                        if (value.price != '') {
                          obj.price = value.price
                        }
                        if (that.data.bookIf){
                          obj.courseSeriesCode = that.data.wxSearchData.value; // 课程代码
                          obj.courseId = that.data.codeIdText        //课程编号
                        }
                       wx.request({
                         url: app.data.Interface + "/books/addBooks",
                         data: obj,
                         success: (res2) => {
                            console.log(res2)
                           if (res2.statusCode == 200){
                             wx.hideLoading()
                             wx.showModal({
                               title: '提示',
                               content: '商品发布成功,确定返回首页',
                               showCancel: false,
                               success: (res3) => {
                                 if (res3.confirm) {
                                   wx.reLaunch({
                                     url: '/pages/index/index',
                                   })
                                 }
                               }
                             })
                           }else{
                             wx.hideLoading()
                             wx.showModal({
                               title: '警告',
                               content: '数据上传失败，请检查网络状况',
                               showCancel: false,
                               success: (res3) => {
                                 if (res3.confirm) {
                                   wx.reLaunch({
                                     url: '/pages/index/index',
                                   })
                                 }
                               }
                             })
                           } 
                         }
                       })
              }
            }
          })
       })
     },
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
      data: {
        isAll: 1
      },
      success: (res) => {
        res.data.data.forEach(function (item, index) {   //分类，加入状态变量
          _this.data.category_list.push(item)
          _this.data.category_list[index].state = false;
          _this.data.category_list[0].state = true;
        })
        _this.setData({
          category_list: _this.data.category_list
        })
        wx.hideLoading()
      }
    })
    wx.getStorage({   //加载课程代码
      key: 'token',
      success: function (res) {
        wx.request({
          url: app.data.Interface + "/books/getCode",
          data: {
            userId: res.data.id,
            token: res.data.token,
          },
          success: (res2) => {
            if (res2.data.reCode == 201) {

              // //初始化的时候渲染wxSearchdata 第二个为你的search高度
              // //热门搜索关键词
              WxSearch.init(_this, 43, [], false, false);
              //搜索的数据
              var codeArr = []
              res2.data.data.forEach(function (item) {
                codeArr.push(item.code)
              })
              _this.data.wxSearchData.mindKeys = codeArr
              _this.setData({
                codeData: codeArr,
                wxSearchData: _this.data.wxSearchData
              })
              WxSearch.initMindKeys(codeArr);
              wx.hideLoading()
            } else {
              wx.showModal({
                title: '提示',
                content: '数据加载失败',
                showCancel: false,
                success: function (res) {
                }
              })
            }
          },
          fail: (err) => {
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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