// pages/mine/myNews/myNews.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  jump:function(e){
    let Type = e.currentTarget.dataset.type;
    switch(Type){
      case "关注":
        wx.navigateTo({ url: '../follow/follow' });
        break;
      case "收藏":
        wx.navigateTo({ url: '../collection/collection' });
        break;
      case "留言":
        wx.navigateTo({ url: '../comment/comment' });
        break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      wx.getStorage({
        key: 'token',
        success: function (res) {
          wx.request({
            url: app.data.Interface + "/app-user/getIsRead",
            data: {
              userId: res.data.id,
              token: res.data.token
            },
            success: function (res2) {
              if (res2.data.reCode == 201) {
                that.setData({
                  isRead: res2.data.data.isRead
                })
              }
            }
          })
        },
        fail: function (err) {

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
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        wx.request({
          url: app.data.Interface + "/app-user/getIsRead",
          data: {
            userId: res.data.id,
            token: res.data.token
          },
          success: function (res2) {
            if (res2.data.reCode == 201) {
              that.setData({
                isRead: res2.data.data.isRead
              })
            }
          }
        })
      },
      fail: function (err) {

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