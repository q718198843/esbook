// pages/getPage/getPage.js
var WxParse = require('../wxParse/wxParse.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.data.Interface + "/index/getPage",
      data:{
        id:id
      },
      success:(res) =>{
        if (res.data.reCode == 201) {
          wx.hideLoading()
          WxParse.wxParse('article', 'html', res.data.data.content, that, 0);
        }else{
          wx.hideLoading()
          wx.showModal({
            title: '警告',
            content: '数据加载失败',
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
                wx.reLaunch({
                  url: '/pages/index/index',
                })
              }
            }
          })
        }
      },
      fail:(err) =>{
        wx.hideLoading()
        wx.showModal({
          title: '警告',
          content: '数据加载加载失败',
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              wx.reLaunch({
                url: '/pages/index/index',
              })
            }
          }
        })
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