//app.js

App({
  data:{
    Interface:"https://xiaocun.imgup.cn/xiaocunApp"
  },
  login:function(url){
    // 展示本地存储能力
    var that = this;
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // 登录
    // console.log(url)
    wx.showLoading({
      title: '加载中',
    })
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          // console.log(res.code)
          wx.getUserInfo({//getUserInfo流程
            success: function (res2) {//获取userinfo成功
              wx.request({
                url: that.data.Interface + "/app-user/getUser",
                data: {
                  js_code: res.code,  // 登录code
                  nickName: res2.userInfo.nickName,  //微信昵称
                  avatarUrl: res2.userInfo.avatarUrl,  //微信头像
                  gender: res2.userInfo.gender // 性别
                },
                success: (res3) => {
                  console.log(res.code)
                  console.log(res2.userInfo.nickName)
                  console.log(res2.userInfo.avatarUrl)
                  console.log(res2.userInfo.gender)
                  console.log(res3)
                  console.log("成功获取id token")
                  if (res3.data.reCode == 201){
                    if (res3.data.data.id && res3.data.data.token) {
                      // wx.setStorage({  //存个人信息
                      //   key: 'user',
                      //   data: res2.userInfo,
                      // })
                      wx.setStorage({ //存入 id token
                        key: 'token',
                        data: res3.data.data,
                      })
                      wx.hideLoading();
                      console.log(res3.data.data.isPhone)
                      if (res3.data.data.isPhone) {
                        console.log("已绑定手机");
                        wx.redirectTo({
                          url: url,
                        });
                      } else {
                        console.log("未绑定手机")
                        wx.navigateTo({
                          url: "/pages/isphone/isphone",
                        });
                      }
                    } else {
                      wx.showModal({
                        title: '警告',
                        content: '用户信息获取失败',
                        showCancel: false,
                        success: (res2) => {
                          if (res2.confirm) {
                            wx.redirectTo({
                              url: "/pages/index/index",
                            });
                          }
                        }
                      })
                    }
                  }else{
                    wx.showModal({
                      title: '警告',
                      content: '服务器数据获取失败',
                      showCancel: false,
                      success: (res2) => {
                        if (res2.confirm) {
                          wx.redirectTo({
                            url: "/pages/index/index",
                          });
                        }
                      }
                    })
                  }
                },
                fail: err3 => {
                  console.log("token 网络请求失败")
                }
              })
            },
            fail: function (err) {
              wx.hideLoading()
              wx.showModal({
                title: '警告',
                content: '若不授权微信登录，则无法使用小村无忧小程序的所有功能；点击重新获取授权，则可重新使用；若点击不授权，后期还使用小程序，需在微信【发现】——【小程序】——删掉【小村无忧】，重新搜索授权登录，方可使用',
                cancelText:"不授权",
                confirmText:"授权",
                success:(res) =>{
                  if (res.confirm) {
                    wx.openSetting({
                      success: function (res) {
                        if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
                          //重新授权成功
                          wx.redirectTo({
                            url: '/pages/mine/mine',
                          });
                        }
                      }
                    })
                  } else if (res.cancel) {
                    wx.redirectTo({
                      url: '/pages/index/index',
                    });
                  }
                }
              })
            }
          })

        }
      }
    })
  },
  onLaunch: function () {
    
  },
  globalData: {
    userInfo: null
  }
})