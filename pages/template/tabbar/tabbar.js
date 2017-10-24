// pages/template/tabbar/tabbar.js
var app = getApp();
function isRead(that, isMine) {
  wx.getStorage({
    key: 'token',
    success: function (res) {
      wx.request({
        url: app.data.Interface + "/app-user/getIsRead",
        data: {
          userId:res.data.id,
          token: res.data.token
        },
        success: function (res2) {
          if (res2.data.reCode == 201) {
            that.data.tabAc.isRead = res2.data.data.isRead;
            that.setData({
              tabAc: that.data.tabAc
            })
          }
        }
      })
    },
    fail: function (err) {

    }
  })
}
module.exports = {
  isRead: isRead
}