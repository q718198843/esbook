// pages/mine/collection/collection.js
var shopList = require('../../shopList/shopList.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collection: [],
    page: 1,
    rows: 3,
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
  others: function (e) {  //跳转到他人主页
    var id = e.currentTarget.dataset.id
    wx.getStorage({
      key: 'token',
      success: function (res) {
        shopList.others(id)
      },
      fail: function (err) {
        wx.redirectTo({
          url: '/pages/mine/mine',
        });
      }
    })
  },
  detail: function (e) { //商品详情
    var id = e.currentTarget.dataset.id
    wx.getStorage({
      key: 'token',
      success: function (res) {
        shopList.detail("商品", id)
      },
      fail: function (err) {
        wx.redirectTo({
          url: '/pages/mine/mine',
        });
      }
    })
  },
  getDataFromServer: function () {
    var that = this;
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    wx.getStorage({
      key: 'token',
      success: function (res) {
        wx.request({
          url: app.data.Interface + "/app-user/queryCollectionList",
          data: {
            userId: res.data.id,
            token: res.data.token,
            page: that.data.page,
            rows: that.data.rows
          },
          success: (res2) => {
            console.log(res2)
            if (res2.data.reCode == 201){
              res2.data.data.data.forEach(function (item) {
                that.data.collection.push(item)
              })
              that.setData({
                collection: that.data.collection
              })
              wx.hideLoading();
            }
          }
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataFromServer()
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
  onReachBottom: function () {  //上拉加载更多
    let that = this;
    that.setData({
      page: that.data.page +1
    })
    this.getDataFromServer()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})