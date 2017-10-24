// pages/isphone/isphone.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hintTXT:"请输入验证码",
    hintHide:false,
    is:true,
    num:60,
    tel:"",
    ycBol:false,
  },
  submit:function(e){
    var that = this;
    if (e.detail.value.code) {
      wx.getStorage({
        key: 'token',
        success: function (res) {
          wx.request({
            url: app.data.Interface + "/app-user/bindUsrePhone",
            data: {
              userId: res.data.id,
              token: res.data.token,
              verifyCode: e.detail.value.code,
              phone: e.detail.value.tel,
            },
            success: (res2) => {
              console.log(res2)
              if (res2.data.reCode == 201) {
                that.setData({
                  ycBol:true
                })
                app.login("/pages/index/index");
              } else {
                that.setData({
                  hintTXT: res2.data.codeTxt,
                  hintHide: true
                })
                setTimeout(function () {
                  that.setData({
                    hintHide: false
                  })
                }, 1000)
              }

            },
            fail: (err) =>{
              // console.log(err)
            }
          })
        },
      })
    } else {
      that.setData({
        hintTXT: "请输入验证码",
        hintHide: true
      })
      setTimeout(function () {
        that.setData({
          hintHide: false
        })
      }, 1000)
    }
  },
  bindblur:function(e){
    this.setData({
      tel: e.detail.value
    })
  },
  hqyzm:function(e){  //获取验证码
  var that = this
  if (that.data.tel != ''){
      if (e.currentTarget.dataset.is) {
        that.setData({
          is: false
        })
        var time = setInterval(function () {
          if (that.data.num != 0) {
            that.setData({
              num: that.data.num - 1
            })
          } else {
            clearInterval(time);
            that.setData({
              is: true,
              num: 60
            })
          }
        }, 1000)
        wx.request({
          url: app.data.Interface + "/sms/send-sms",
          data: {
            phone: that.data.tel,
            sendType: "bind"
          },
          success: (res) => {
            if (res.data.reCode == 201){
              wx.showModal({
                title: '提示',
                content: res.data.data,
                showCancel: false,
              })
            }
          }
        })
    }
  }else{
    wx.showModal({
      title: '提示',
      content: '请输入手机号码',
      showCancel: false,
    })
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
    if(this.data.ycBol){
      var page = getCurrentPages();
      page[0].setData({
        jzdh: false
      })
    }else{
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
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