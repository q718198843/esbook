// pages/mine/feedback/feedback.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hintHide: false,
  },
  submit:function(e){
    // Interface 
    var that = this;
    if (e.detail.value.yj != ''){
      wx.showLoading({
        title: '提交中...',
      })
    wx.getStorage({
      key: 'token',
      success: function (res) {
        wx.request({
          url: app.data.Interface + "/app-user/addFeedback",
          data: {
            userId: res.data.id,
            token: res.data.token,
            content: e.detail.value.yj
          },
          success: (res2) => {
            if (res2.statusCode == 200){
              wx.hideLoading()
              wx.showModal({
                title: '提示',
                content: '尊敬的小村大优用户非常感谢您的建议，我们的攻城狮和设计狮们将会根据您的建议改进我们的产品。',
                showCancel: false,
                success: (res3) => {
                  if (res3.confirm) {
                    wx.navigateBack({
                      delta: 0
                    })
                  }
                }
              }) 
            }
          }
        })
      },
    })
  }else{
      that.setData({
        hintTXT: "请输入您的意见",
        hintHide: true
      })
      setTimeout(function () {
        that.setData({
          hintHide: false
        })
      }, 1000)
  }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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