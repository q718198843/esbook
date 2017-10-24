// pages/confirm/confirm.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    confirmData: "",
    imageURL: []
  },
  fanhui: function (e) {
    let item = e.currentTarget.dataset.item;
    let page = getCurrentPages();
    let that = this;
    wx.setStorage({
      key: 'addBooks',
      data: that.data.confirmData,
    })
    page[2].setData({
      randomId: item.randomId,
      kongzhi: true
    })
    wx.navigateBack({
      delta: 1
    })
  },
  del: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    that.data.confirmData.splice(index, 1)
    that.setData({
      confirmData: that.data.confirmData
    });
    wx.setStorage({
      key: 'addBooks',
      data: that.data.confirmData,
    })
  },
  upload: function () {
    var that = this;
    if (that.data.confirmData != "") {
      wx.showLoading({
        title: '正在上传',
      })
      var bol = true;
      that.data.confirmData.forEach(function (item) {
        // var imageURL = [];
        // var caonima = [];
        delete item.randomId;
        item.imgsIds = item.imgsIds.join(",");
        wx.request({
          url: app.data.Interface + "/books/addBooks",
          data: item,
          success: function (res) {
            console.log("发布成功")
            if (res.data.reCode == 201) {
              wx.showLoading({
                title: '上传成功',
              })
              // that.setData({
              //   confirmData: ""
              // })
              //  console.log(res)
              wx.reLaunch({
                url: '/pages/index/index',
                success: function () {
                  wx.removeStorage({
                    key: 'addBooks',
                    success: function (res) {
                      console.log("发布数据缓存清理成功")
                    }
                  })
                  wx.hideLoading();
                }
              })
            } else {
              wx.hideLoading()
              wx.showLoading({
                title: '上传失败',
              })
              setTimeout(function () {
                wx.hideLoading();
                wx.redirectTo({
                  url: '/pages/index/index',
                  success: function () {
                    wx.hideLoading();
                  }
                })
              }, 2000)
            }
          },
          fail: (err) => {
            wx.hideLoading();
            wx.showModal({
              title: '警告',
              content: '上传失败，请检查网络环境',
              showCancel: false,
            })
          }
        })
        // caonima = item;
        // item.imgsIds.forEach(function (item2) {
        //   // app.data.Interface
        //   // if (item2.indexOf('wx') != -1) {
        //   //   bol = false;
        //   //   wx.uploadFile({
        //   //     url: app.data.Interface + "/image/save",
        //   //     filePath: item2,
        //   //     name: 'file',
        //   //     success: function (res) {
        //   //       res = JSON.parse(res.data);
        //   //       imageURL.push(res.data)
        //   //       if (imageURL.length == item.imgsIds.length) {
        //   //         bol = true
        //   //       }
        //   //     },
        //   //     fail: (err) => {
        //   //       console.log(err)
        //   //       wx.hideLoading();
        //   //       wx.showModal({
        //   //         title: '警告',
        //   //         content: '上传失败，请检查网络环境',
        //   //         showCancel: false,
        //   //       })
        //   //     }
        //   //   })
        //   // } else {
        //   //   imageURL.push(item2)
        //   //   bol = true
        //   // }

        // })

        // function a() {
        //   if (bol) {
        //     bol = false;
        //     // item.imgsIds = imageURL.join(",");
        //     console.dir(item)
        //      return false

        //     return false;
        //   }
        //   setTimeout(a, 1)
        // }
        // a();
      })

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })

    wx.getStorage({
      key: 'addBooks',
      success: function (res) {
        console.log(res)
        that.data.confirmData = res.data;
        that.setData({
          confirmData: that.data.confirmData
        })
        wx.hideLoading();
      },
    })
    wx.getStorage({
      key: 'addBooksG',
      success: function (res) {
        that.data.confirmData.forEach(function (item, index) {
          if (item.randomId == res.data.randomId) {
            that.data.confirmData[index] = res.data
            that.setData({
              confirmData: that.data.confirmData
            })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})