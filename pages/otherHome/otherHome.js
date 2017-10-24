// pages/otherHome/otherHome.js
var shopList = require('../shopList/shopList.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    heData:"",
    bookTypes:"sell",
    page:1,
    rows:2,
    booksSell:[],
    booksBuy:[],
    isfist:true,
    images: [],
  },
  imageLoad: function (e) {
    var $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;    //图片的真实宽高比例
    var viewWidth = 750,           //设置图片显示宽度，左右留有16rpx边距
      viewHeight = 750 / ratio;    //计算的高度值
    //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
    this.data.images[e.target.dataset.index] = {
      width: viewWidth,
      height: viewHeight,
    }
    this.setData({
      images: this.data.images
    })
  },
  follow:function(e){    //关注
    var id = e.currentTarget.dataset.id
    let Interface = '';
    let that = this;
    if(!that.data.ismy){
      if (that.data.heData.user.isfollow) {
        Interface = "/app-user/delFollow"
      } else {
        Interface = "/app-user/addFollow"
      }
      wx.getStorage({
        key: 'token',
        success: function (res) {
          wx.request({
            url: app.data.Interface + Interface,
            data: {
              userId: res.data.id,
              token: res.data.token,
              userToId: id
            },
            success: (res2) => {
              if (res2.data.reCode == 201) {
                wx.showModal({
                  title: '提示',
                  content: res2.data.data,
                  showCancel: false
                })
                that.data.heData.user.isfollow = !that.data.heData.user.isfollow;
                that.setData({
                  heData: that.data.heData
                })
              } else {
                wx.showModal({
                  title: '警告',
                  content: '操作出错',
                  showCancel: false
                })
              }
            }
          })
        },
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '不能关注自己',
        showCancel: false,
      })
    }
  },
  getDataFromServer: function (page){
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.getStorage({
      key: 'token',
      success: function(res) {
        wx.request({
          url: app.data.Interface + "/books/queryList",
          data:{
            userId:res.data.id,
            token:res.data.token,
            heId: that.data.heData.user.id,
            bookTypes: that.data.bookTypes,
            page: page,
            rows:that.data.rows
          },
          success: (res2) =>{
            let data = res2.data.data.data
            if (!that.data.isfist) {
              data.forEach(function (item) {
                if (that.data.bookTypes == 'sell') {
                  that.data.booksSell.push(item)
                } else {
                  that.data.booksBuy.push(item)
                }
              })
              that.setData({
                booksSell: that.data.booksSell,
                booksBuy: that.data.booksBuy
              })
            } else {
              if (that.data.bookTypes == 'sell') {
                that.setData({
                  booksSell: data
                })
              } else {
                that.setData({
                  booksBuy: data
                })
              }
              that.setData({
                isfist: false
              })
            }
            wx.hideLoading()
          }
        })
      },
    })
  },
  typeTab:function(e){
    let Type = e.currentTarget.dataset.type
    this.setData({
      bookTypes:Type,
      isfist:true
    })
    this.getDataFromServer(1)
  },
  detail:function(e){
    //跳转商品详情页面
    let id = e.currentTarget.dataset.id
    shopList.detail("商品", id)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let heId = options.id;
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.getStorage({
      key: 'token',
      success: function(res) {
        wx.request({
          url: app.data.Interface + "/app-user/getHeIndex",
          data:{
            userId:res.data.id,
            token:res.data.token,
            heId: heId
          },
          success:(res2) =>{
            if (res2.statusCode == 200){
              wx.hideLoading()
              if (res2.data.codeTxt == "未绑定手机号"){
                wx.showModal({
                  title: '温馨提示',
                  content: '尊敬的小村大优用户，欢迎您使用我们的平台，请您验证手机号码解锁更多功能。',
                  // showCancel: false,
                  success: (res2) => {
                    if (res2.confirm) {
                      wx.redirectTo({
                        url: "/pages/isphone/isphone",
                      });
                    }else{
                      wx.redirectTo({
                        url: "/pages/index/index",
                      });
                    }
                  }
                })
              }else{
                that.setData({
                  heData: res2.data.data
                })
                if (res.data.id == that.data.heData.user.id) {
                  that.setData({
                    ismy: true
                  })
                  // wx.setNavigationBarTitle({
                  //   title: title
                  // })
                }
                that.getDataFromServer(that.data.page)
              }
            }else{
              wx.hideLoading()
              wx.showModal({
                title: '提示',
                content: '数据错误',
                showCancel: false,
                success:(res3)=>{
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
    let that = this;
    that.setData({
      page: that.data.page + 1
    })
    that.getDataFromServer(that.data.page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    let that = this;
    if (e.from == "menu"){
      return {
        title: '来围观一波' + that.data.heData.user.name+'的发布吧',
        // path: '/page/user?id=123',
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
  }
})