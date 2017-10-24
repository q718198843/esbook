// pages/mine/changePhone/changePhone.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldPhone:"",
    is: true,
    num: 60,
  },
  oldPhone:function(e){   //获取输入的旧手机号码
      this.setData({
        oldPhone: e.detail.value
      })
  },
  hqyzm:function(e){  //获取验证码
    let that = this;
    if (e.currentTarget.dataset.is) {
      that.setData({
        is: false
      })
      console.log(that.data.num)
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
          phone: that.data.oldPhone,
          sendType: "bind"
        },
        success: (res) => {
          console.log(res)
          if (res.data.reCode != 201){
            wx.showModal({
              title: '提示',
              content: '请输入正确的手机号码',
              showCancel: false,
            })
          }
        },
        fail:(err)=>{
          wx.showModal({
            title: '提示',
            content: '请输入正确的手机号码',
            showCancel: false,
          })
        }
      })
    }
  },
  submit:function(e){
    let value = e.detail.value;
    let title = "";
    let that = this;
    if (value.oldPhone == ''){
        title = "请输入正确的旧手机号码"
    } else if (value.newPhone == ''){
        title = "请输入正确的新手机号码"
    } else if (value.code == ''){
        title = "请输入验证码"
    }
    if (value.oldPhone != '' && value.newPhone != '' && value.code != '' ){
        wx.getStorage({
          key: 'token',
          success: function(res) {
            wx.request({
              url: app.data.Interface + "/app-user/changePhone",
              data:{
                userId:res.data.id,
                token:res.data.token,
                phone:that.data.oldPhone,
                verifyCode: value.code,
                newPhone: value.newPhone
              },
              success: (res2) =>{
                console.log(res2)
                if (res2.data.reCode == 201){
                  wx.showLoading({
                    title: '修改成功',
                  })
                  let data = res.data;
                  data.phone = value.newPhone
                  wx.setStorage({
                    key: 'token',
                    data: data,
                    success:(res3) =>{
                      wx.hideLoading()
                      wx.reLaunch({
                        url: '/pages/mine/mine',
                      });
                    }
                  })
                }else{
                  wx.showModal({
                    title: '提示',
                    content: res2.data.codeTxt,
                    showCancel: false,
                  })
                }
              }
            })
          },
        })
    }else{
      wx.showModal({
        title: '提示',
        content: title,
        showCancel: false,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.Phone){
      console.log(options.Phone)
      this.setData({
        oldPhone: options.Phone
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