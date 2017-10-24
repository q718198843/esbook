// pages/mine/follow/follow.js
var shopList = require('../../shopList/shopList.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    follow:[],
    page:1,
    rows:10,
  },
  follow: function (e) {    //关注
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    let Interface = '';
    let that = this;
    var content = '';
    if (that.data.follow[index].isfollow) {
      Interface = "/app-user/delFollow";
      content = "是否确定取消关注"
    } else {
      Interface = "/app-user/addFollow";
      content = "是否确定继续关注"
    }
    wx.showModal({
      title: '提示',
      content: content,
      success:(res1) =>{
        if (res1.confirm) {
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
                    that.data.follow[index].isfollow = !that.data.follow[index].isfollow;
                    that.setData({
                      follow: that.data.follow
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
        } else if (res1.cancel) {
          // console.log('用户点击取消')
        }
      }
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
  getDataFromServer:function(){
    var that = this;
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    wx.getStorage({
      key: 'token',
      success: function (res) {
        wx.request({
          url: app.data.Interface + "/app-user/queryfollowList",
          data: {
            userId: res.data.id,
            token: res.data.token,
            page: that.data.page,
            rows: that.data.rows
          },
          success: (res2) => {
            console.log(res2)
            res2.data.data.data.forEach(function (item,index) {
              that.data.follow.push(item)
              that.data.follow[index].isfollow = true
            })
            that.setData({
              follow: that.data.follow
            })
            wx.hideLoading()
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
      page:that.data.page +1
    })
    this.getDataFromServer()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})