// pages/activity/activity.js
var WxParse = require('../wxParse/wxParse.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time:"",
    title:"",
    id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      id: options.id
    });
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.data.Interface + "/activity/getActivity",
      data: {
        id: options.id
      },
      success: (res2) => {
        console.log(res2.data)
        if (res2.data.reCode == 201){
          wx.hideLoading()
          WxParse.wxParse('article', 'html', res2.data.data.content, _this, 0);
          _this.setData({
            time: res2.data.data.time,
            title: res2.data.data.title
          })
        }else{
          wx.hideLoading()
          wx.showModal({
            title: '警告',
            content: '活动加载失败',
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
      fail: (err) => {
        wx.hideLoading()
        wx.showModal({
          title: '警告',
          content: '活动加载失败',
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
    // wx.setNavigationBarTitle({  //动态设置title
    //   title:_this.data.text
    // })
  },
  submit:function(e){
    let value = e.detail.value;
    let that = this;
    if(value.tel.length == 11 && value.name != ''){
      wx.getStorage({
        key: 'token',
        success: function (res) {
          //判断是否绑定手机
          wx.showLoading({
            title: '加载中',
          })
          if (res.data.isPhone) {
            wx.request({
              url: app.data.Interface + "/activity/addActivity",
              data:{
                userId:res.data.id,
                token:res.data.token,
                id:that.data.id,
                name: value.name,
                phone: value.tel
              },
              success:(res2) =>{
                wx.hideLoading()
                if (res2.data.reCode == 201){
                  wx.showModal({
                    title: '提示',
                    content: '报名成功',
                    showCancel: false
                  })
                }else{
                  wx.showModal({
                    title: '提示',
                    content: '报名错误',
                    showCancel: false
                  })
                }
              },
              fail:(err) =>{
                wx.hideLoading()
                wx.showModal({
                  title: '提示',
                  content: '报名失败，请检查网络环境',
                  showCancel: false
                })
              }
            })
          } else {
            wx.showModal({
              content: '绑定手机号码',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: "/pages/isphone/isphone",
                  });
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        },
        fail: (err) => {
          app.login("/pages/index/index")
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请填写正确报名的信息',
        showCancel: false
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