// pages/detail/Detail.js
var shopList = require('../shopList/shopList.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment:[
    ],
    animData: {},
    animData2:{},
    fxBol:false,
    display: "none",
    bol:true,
    collXX:false,
    books:"",
    jzdh:false,
    isCollenction:false,
    com:false,
    images:[],
    cPage:1,
  },
  previewImage: function (e) { //图片预览
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: this.data.books.imageUrl // 需要预览的图片http链接列表
    })
  },
  previewImage2: function (e) { //图片预览
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: this.data.comment[e.currentTarget.dataset.index].commentUrl // 需要预览的图片http链接列表
    })
  },
  previewImage3: function (e) { //图片预览
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: this.data.comment[e.currentTarget.dataset.index].booksDeComment[e.currentTarget.dataset.idx].commentUrl // 需要预览的图片http链接列表
    })
  },
  imageLoad: function(e) {
    var $width=e.detail.width,    //获取图片真实宽度
        $height=e.detail.height,
        ratio=$width/$height;    //图片的真实宽高比例
    var viewWidth=750,           //设置图片显示宽度，左右留有16rpx边距
        viewHeight=750/ratio;    //计算的高度值
    //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
    this.data.images[e.target.dataset.index]={
        width:viewWidth,
        height:viewHeight,
    }
    this.setData({
      images: this.data.images
    })
},
  upPhoto: function (e) { //打开底部选项
    var that = this;
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
      transformOrigin: "50% 50%"
    })
    this.animation = animation;
    if (e.currentTarget.dataset.who == "分享"){
      animation.bottom("0rpx").step();
      this.setData({
        animData2: animation.export(),
        display: "block",
        fxBol:true
      })
    }else{
      wx.getStorage({
        key: 'token',
        success: function(res) {
          console.log(res)
          if (res.data.isPhone) {
            animation.bottom("23.4rpx").step();
            that.setData({
              animData: animation.export(),
              display: "block"
            })
          } else {
            wx.showModal({
              title: '温馨提示',
              content: '尊敬的小村大优用户，欢迎您使用我们的平台，请您验证手机号码解锁更多功能。',
              // showCancel: false,
              success: (res2) => {
                if (res2.confirm) {
                  wx.redirectTo({
                    url: "/pages/isphone/isphone",
                  });
                }
              }
            })
          }
        },
      })
    }
    
  },
  close: function (e) {   //关闭底部选项
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
      transformOrigin: "50% 50%"
    })
    this.animation = animation;
    animation.bottom("-500rpx").step()
    if(this.data.fxBol){
      this.setData({
        display: "none",
        animData2: animation.export(),
      })
    }else{
      this.setData({
        display: "none",
        animData: animation.export(),
      })
    }
    
  },
  phoneCall:function(){
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.books.phone, // 拨打电话
      complete: (res) =>{
        console.log(res)
        console.log("拨打电话结束")
        that.close();
      }
    })
  },
  others: function (e) {  //跳转到他人主页
    var id = e.currentTarget.dataset.id
    console.log(id)
    wx.getStorage({
      key: 'token',
      success: function (res) {
        shopList.others(id)
      },
      fail: function (err) {
        wx.redirectTo({
          url: '/pages/index/index',
        });
      }
    })
  },
  addcomm:function(e){  //发布评论
    let that = this;
    wx.navigateTo({ url: '/pages/addcomment/addcomment?id=' + that.data.books.id + '&type=评论'})
    that.close();
  },
  xj:function(){
    var page = getCurrentPages();
    var that = this;
    wx.showModal({
      content: '确定下架',
      success: function (res) {
        if (res.confirm) {
          wx.getStorage({
            key: 'token',
            success: function (res) {
              wx.request({
                url: app.data.Interface + "/books/updow",
                data: {
                  userId: res.data.id,
                  token: res.data.token,
                  type: "dow",
                  booksId: that.data.books.id
                },
                success: (res2) => {
                  wx.reLaunch({
                    url: '/pages/index/index'
                  })
                }
              })
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  upShop: function (e) {
    let that = this;
    wx.showModal({
      content: '确定重新上架',
      success: function (res) {
        if (res.confirm) {
          wx.getStorage({
            key: 'token',
            success: function (res) {
              wx.request({
                url: app.data.Interface + "/books/updow",
                data: {
                  userId: res.data.id,
                  token: res.data.token,
                  type: "up",
                  booksId: that.data.books.id
                },
                success: (res2) => {
                  if (res2.statusCode == 200) {
                    wx.reLaunch({
                      url: '/pages/index/index'
                    })
                  }
                }
              })
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  collection:function(e){  //收藏
    let that = this;
    if(!that.data.ismy){
      let id = e.currentTarget.dataset.id;
      let title = "";
      let title2 = "";
      let Type = "";
      if (that.data.isCollenction) {
        title = "已取消收藏";
        title2 = "是否取消收藏";
        Type = "/books-collection/del";
      } else {
        title = "收藏成功";
        title2 = "确定收藏";
        Type = "/books-collection/add";
      }
      wx.showModal({
        title: '提示',
        content: title2,
        success: (res1) => {
          if (res1.confirm) {
            wx.getStorage({
              key: 'token',
              success: function (res2) {
                wx.request({
                  url: app.data.Interface + Type,
                  data: {
                    userId: res2.data.id,
                    token: res2.data.token,
                    booksId: id
                  },
                  success: (res3) => {
                    if (res3.statusCode == 200) {
                      that.setData({
                        isCollenction: !that.data.isCollenction
                      })
                      if (that.data.isCollenction) {
                        wx.showToast({
                          title: title,
                          icon: 'success',
                          duration: 1000
                        })
                      } else {
                        wx.showToast({
                          title: title,
                          icon: 'success',
                          duration: 1000
                        })
                      }
                    }
                  }
                })
              },
            })
          }
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '不能收藏自己的商品',
        showCancel: false,
      })
    }
  },
  share:function(){
    this.onShareAppMessage();
  },
  edits:function(e){
    var id = e.currentTarget.dataset.id;
    if (e.currentTarget.dataset.types == "sell"){
      wx.navigateTo({
        url: '/pages/editshop/editshop?id=' + id,
      })
    }else{
      wx.navigateTo({
        url: '/pages/editBuy/editBuy?id=' + id,
      })
    }

  },
  huifu:function(e){  //回复评论
    let that = this;
    wx.navigateTo({ url: '/pages/addcomment/addcomment?id=' + that.data.books.id + '&type=回复' + '&plid=' + e.currentTarget.dataset.id + '&userid=' + e.currentTarget.dataset.userid})
  },
  getcomment:function(){  //获取评论
  let that = this;
    wx.getStorage({
      key: 'token',
      success: function(res) {
        wx.request({
          url: app.data.Interface + "/books-comment/queryList",
          data:{
            page: that.data.cPage,
            rows:0,
            userId:res.data.id,
            token:res.data.token,
            booksId: that.data.books.id
          },
          success: (res2) =>{
            // console.log(res2)
            if (res2.data.reCode == 201){
              that.setData({
                comment:res2.data.data.data
              })
            }else{
              wx.showModal({
                title: '警告',
                content: '评论列表加载失败，请从新打开页面',
                showCancel: false,
              })
            }
          },
          fail: (err) =>{
            wx.showModal({
              title: '警告',
              content: '评论列表加载失败，请从新打开页面',
              showCancel: false,
            })
          }
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      com:false
    })
    switch (options.text) {
      case "我的":
        this.setData({
          bol: false
        })
        break;
      case "商品":
        this.setData({
          bol: true
        })
        break;
    }
    wx.showLoading({
      title: '加载中...',
    })
    wx.getStorage({
      key: 'token',
      success: function (res) {
        wx.request({
          url: app.data.Interface + "/books/getDetails",
          data: {
            userId: res.data.id,
            token: res.data.token,
            booksId: options.id
          },
          success: (res2) => {
            if (res2.data.reCode == 201){
              that.setData({
                // comment: res2.data.data.booksComment, //评论
                books: res2.data.data.books,  //商品数据
                isCollenction: res2.data.data.isCollenction,
                com:false,
                ismy: res2.data.data.ismy
              })
              wx.hideLoading();
              console.log(res2)
              that.getcomment();
            }else{
              wx.hideLoading()
              that.setData({
                jzdh: true
              })
              wx.showModal({
                title: '警告',
                content: '该书籍数据不存在',
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
      },
      fail: (err) => {
        console.log(options.id)
        app.login('/pages/detail/Detail?text=商品&id=' + options.id);
      }
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
    if (this.data.com) {
      wx.redirectTo({ url: '/pages/detail/Detail?text=商品&id=' + this.data.books.id });
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    let that = this;
    var Type = ""
    console.log(that.data.books)
    that.data.books.bookTypes == "sell" ? Type = "出售" : Type = "求购";
    if (e.from == "button"){
      return {
        title: "【" + Type +"】" + that.data.books.name,
        imageUrl: that.data.books.imageUrl[0],
        path: '/pages/detail/Detail?text=商品&id=' + that.data.books.id
      }
    }
  }
})