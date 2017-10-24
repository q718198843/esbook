// pages/editshop/editshop.js
var WxSearch = require('../wxSearch/wxSearch.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category_list: [],
    editshopData: '',
    images: [],
    bookIf: false,
    booksId: "",
    delImg: [],//删除的图片
    codeData: "",
    codeIdData: "",
    codeText: "请选择课程代码",
    codeIdText: "请选择课程编号"
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
    //   codeText: that.data.codeData[index].code
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
    //             codeIdText: "请选择课程编号"
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
  upPhoto: function (e) {
    var _this = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let images = _this.data.images;
        let Photo = res.tempFilePaths;
        Photo.forEach(function (item) {
          var obj = {
            id: '',
            url: item
          }
          images.push(obj)
        })
        _this.setData({
          images: images
        })
      }
    })
  },
  previewImage: function (e) { //图片预览
    let img = [];
    this.data.images.forEach(function (item) {
      img.push(item.url)
    })
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: img// 需要预览的图片http链接列表
    })
  },
  delImage: function (e) {  //删除图片
    let index = e.currentTarget.dataset.index;
    let that = this;
    if (that.data.images[index].id != '') {
      wx.showModal({
        title: '提示',
        content: '是否删除已有的图片',
        success: (res) => {
          if (res.confirm) {
            wx.showLoading({
              title: '正在删除图片...',
            })
            wx.getStorage({
              key: 'token',
              success: function (res) {
                wx.request({
                  url: app.data.Interface + '/books/delImg',
                  data: {
                    userId: res.data.id,
                    token: res.data.token,
                    booksId: that.data.booksId,
                    id: that.data.images[index].id
                  },
                  success: (res2) => {
                    that.data.images.pop(index);
                    that.setData({
                      images: that.data.images,
                    })
                    if (res2.statusCode == 200) {
                      wx.hideLoading()
                      wx.showModal({
                        title: '提示',
                        content: '图片删除成功',
                        showCancel: false,
                        success: (res) => {

                        }
                      })
                    }
                  }
                })
              },
            })
          }
        }
      })
    } else {
      that.data.images.pop(index)
    }
    that.setData({
      images: that.data.images,
    })
  },
  state: function (e) {  //星星
    let that = this
    that.data.editshopData.oldandnew = e.currentTarget.dataset.index
    that.setData({
      editshopData: that.data.editshopData
    })
  },
  submit: function (e) {  //提交商品信息
    var formData = e.detail.value;
    var that = this;
    console.log(formData)
    wx.getStorage({
      key: 'token',
      success: function (res) {
        let bookTypeIds = [];
        that.data.category_list.forEach(function (item) {
          if (item.state) {
            bookTypeIds.push(item.id)
          }
        });
        var images = [];
        wx.showLoading({
          title: '上传中...',
        })
        var bol = true
        that.data.images.forEach(function (item) {
          if (item.id == '') {
            bol = false
            wx.uploadFile({
              url: app.data.Interface + '/image/save',
              filePath: item.url,
              name: 'file',
              success: (res1) => {
                if (res1.statusCode == 200) {
                  images.push(JSON.parse(res1.data).data)
                  if (images.length == that.data.images.length){
                      bol = true
                  }
                }
              },
              fail: (err) => {
                wx.showModal({
                  title: '警告',
                  content: '图片上传失败,请检查网络环境',
                  showCancel: false,
                })
              }
            })
          } else {
            images.push(item.url)
          }
        })
        function a(){
          if(bol){
            wx.hideLoading()
            that.data.images.forEach(function(item,index){
              if (images.indexOf(item.url) != -1){
                images.splice(images.indexOf(item.url), 1)
              }
            })
            // console.log(images)
            // return false;
            let addBooks = {
              userId: res.data.id,  //用户id
              token: res.data.token,   //用户token
              id: that.data.booksId,//商品id
              name: formData.shopName,  //书籍名称
              describes: formData.desc,   //描述
              oldandnew: that.data.editshopData.oldandnew,      //新旧程度
              price: formData.price,         //购买价格
              bookTypes: 'sell',   //发布 or 求购
              // imgsIds: images.join(","),         //图片
              bookTypeIds: bookTypeIds.join(",")     //类别
            }
            if (images != ''){
              addBooks.imgsIds = images.join(",")//图片
            }
            if (formData.Orprice != "") {
              addBooks.originalPrice = formData.Orprice //原价
            }
            if (that.data.bookIf) {
              addBooks.courseSeriesCode = formData.Bookcode; // 课程代码
              addBooks.courseId = formData.Bookid         //课程编号
            }
            if (that.data.bookIf) {
              if (that.data.wxSearchData.value == '' || that.data.wxSearchData.value == undefined ){
                that.data.wxSearchData.value = that.data.codeText
              }
              if (that.data.codeData.indexOf(that.data.wxSearchData.value) != -1) {
                addBooks.courseSeriesCode = that.data.wxSearchData.value; // 课程代码
              } else {
                wx.showModal({
                  title: '提示',
                  content: '请选择正确的课程代码1',
                  showCancel: false,
                  success: function (res) {
                  }
                })
                return false;
              }
              addBooks.courseId = that.data.codeIdText        //课程编号
            }
            var hintTXT = "";
            if (addBooks.name == "") {
              hintTXT = "请输入书名"
            } else if (addBooks.bookTypeIds == "") {
              hintTXT = "请选择分类"
            } else if (that.data.bookIf) {
            if (addBooks.courseSeriesCode == "") {
                hintTXT = "请输入课程代码"
            } else if (addBooks.courseId == "" || addBooks.courseId == "请选择课程编号") {
                hintTXT = "请输入课程编号"
              } else if (addBooks.describes == "") {
                hintTXT = "请输入描述"
              } else if (addBooks.price == "") {
                hintTXT = "请选择价格"
              } else if (addBooks.oldandnew == "") {
                hintTXT = "请输入新旧程度"
              } else if (that.data.images == "") {
                hintTXT = "请选择图片"
              }
            } else if (addBooks.describes == "") {
              hintTXT = "请输入描述"
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
              // console.log(addBooks)
              // return false;
              wx.request({
                url: app.data.Interface + "/books/upBooks",
                data: addBooks,
                success: (res) => {
                  if (res.data.reCode == 201) {
                    wx.hideLoading()
                    wx.showModal({
                      title: '提示',
                      content: '商品数据更新成功',
                      showCancel: false,
                      success: (res) => {
                        if (res.confirm) {
                          wx.reLaunch({
                            url: '/pages/mine/mine',
                          })
                        }
                      }
                    })
                  } else {
                    wx.hideLoading()
                    wx.showModal({
                      title: '警告',
                      content: '商品数据更新失败,请检查网络环境',
                      showCancel: false,
                      success: (res) => {
                        if (res.confirm) {
                          wx.reLaunch({
                            url: '/pages/mine/mine',
                          })
                        }
                      }
                    })
                  }
                },
                fail: (err) => {
                  wx.hideLoading()
                  wx.showModal({
                    title: '警告',
                    content: '商品数据更新失败,请检查网络环境',
                    showCancel: false,
                    success: (res) => {
                      if (res.confirm) {
                        wx.reLaunch({
                          url: '/pages/mine/mine',
                        })
                      }
                    }
                  })
                }
              })
            }
            return false;
          }
          setTimeout(a,1)
        }
        a()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.showLoading({
      title: '商品信息获取中...',
    })
    _this.setData({
      booksId: options.id
    })
    wx.getStorage({
      key: 'token',
      success: function (res) {
        wx.request({
          url: app.data.Interface + "/books/edit",
          data: {
            userId: res.data.id,
            token: res.data.token,
            booksId: _this.data.booksId
          },
          success: (res2) => {
            if (res2.data.reCode == 201) {
              res2.data.data.type.forEach(function (item, index) {
                _this.data.category_list.push(item);
                _this.data.category_list[index].state = false;
                res2.data.data.typeids.forEach(function (item2, index2) {
                  if (_this.data.category_list[index].id == item2) {
                    _this.data.category_list[index].state = true;
                  }
                })
              })
              res2.data.data.image.forEach(function (item) {
                _this.data.images.push(item)
              })
              _this.setData({
                editshopData: res2.data.data,
                category_list: _this.data.category_list,
                images: _this.data.images,
                bookIf: res2.data.data.isType,
              })
              if (res2.data.data.isType){
                if (res2.data.data.courseId != undefined && res2.data.data.courseSeriesCode != undefined){
                  // _this.data.wxSearchData = {}
                  // _this.data.wxSearchData.value = res2.data.data.courseSeriesCode
                  _this.setData({
                    // wxSearchData: _this.data.wxSearchData,
                    codeIdText: res2.data.data.courseId,
                    codeText: res2.data.data.courseSeriesCode
                  })
                }
              }
              wx.hideLoading();
            } else {
              wx.hideLoading()
              wx.showModal({
                title: '警告',
                content: '商品信息获取失败,请检查网络环境',
                showCancel: false,
                success: (res) => {
                  if (res.confirm) {
                    wx.reLaunch({
                      url: '/pages/mine/mine',
                    })
                  }
                }
              })
            }
          },
          fail: (err) => {
            wx.hideLoading()
            wx.showModal({
              title: '警告',
              content: '商品信息获取失败,请检查网络环境',
              showCancel: false,
              success: (res) => {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '/pages/mine/mine',
                  })
                }
              }
            })
          }
        })
      },
    })
    wx.getStorage({  //加载课程代码
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