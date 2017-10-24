// pages/mine/comment/comment.js
var shopList = require('../../shopList/shopList.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment: [],
    page: 1,
    rows: 8
  },
  // others: function (e) {  //跳转到他人主页
  //   var id = e.currentTarget.dataset.id
  //   wx.getStorage({
  //     key: 'token',
  //     success: function (res) {
  //       shopList.others(id)
  //     },
  //     fail: function (err) {
  //       wx.redirectTo({
  //         url: '/pages/mine/mine',
  //       });
  //     }
  //   })
  // },
  addIsRead:function(obj){
    console.log(obj)
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function(res) {
        wx.request({
          url: app.data.Interface + "/app-user/addIsRead",
          data:{
            userId:res.data.id,
            token:res.data.token,
            noteId: obj.id
          },
          success:function(res2){
            if (res2.data.reCode == 201){
              that.data.comment.forEach(function(item,index){
                  if(item.id == obj.id){
                    that.data.comment[index].isRead = true;
                  }
              })
              that.setData({
                comment: that.data.comment
              })
            }
          }
        })
      },
    })
  },
  detail: function (e) { //商品详情
    var item = e.currentTarget.dataset.item;
    if (!item.isRead){
      this.addIsRead(item);
    }
    // return false
    wx.getStorage({
      key: 'token',
      success: function (res) {
        shopList.detail("商品", item.booksId)
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
          url: app.data.Interface + "/app-user/queryNoteList",
          data: {
            userId: res.data.id,
            token: res.data.token,
            page: that.data.page,
            rows: that.data.rows
          },
          success: (res2) => {
            if (res2.data.reCode == 201) {
              res2.data.data.data.forEach(function (item) {
                that.data.comment.push(item)
              })
              that.setData({
                comment: that.data.comment
              })
              wx.hideLoading()
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
    console.log(this.data.comment)
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
    this.getDataFromServer()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})