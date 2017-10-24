// pages/mine/mine.js
var app = getApp();
var tabbar = require('../template/tabbar/tabbar.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sc:false,
    tabAc:{
      sw:1,
      isRead:false
    },
    avatar_big:"", //头像
    nickName:"",  //名字
    gender:"",    //性别
    school:"", //学校
    tel:'', //手机号码
    schoolYear:"", //大学学年
    jzdh: true,
    bol:false,
    update:false,
  },
  tabbarTab: function (event) {
    switch (event.currentTarget.dataset.index) {
      case "首页": wx.redirectTo({
        url: '/pages/index/index',
      });
        break;
      case "上传": 
        var sc = this.data.sc;
        this.setData({
          sc: true
        })
        break;
      case "我的":return;
        break;
    }
  },
  delSc: function () {  //关闭上传
    var sc = this.data.sc;
    this.setData({
      sc: false
    })
  },
  sell: function () {  //出售商品跳转
    wx.getStorage({
      key: 'token',
      success: function (res) {
        //判断是否绑定手机
        if (res.data.isPhone) {
          wx.navigateTo({ url: '/pages/upPhotos/upPhotos' })
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '尊敬的小村大优用户，欢迎您使用我们的平台，请您验证手机号码解锁更多功能。',
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
  },
  wantBuy: function () { //求购商品跳转
    wx.getStorage({
      key: 'token',
      success: function (res) {
        //判断是否绑定手机
        if (res.data.isPhone) {
          wx.navigateTo({ url: '/pages/demand/demand' })
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '尊敬的小村大优用户，欢迎您使用我们的平台，请您验证手机号码解锁更多功能。',
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
  },
  setUp:function(){  //个人信息设置页
    let info = {};
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        wx.hideToast();
        if (!res.data.isPhone) {
          wx.showModal({
            content: '绑定手机号码',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: "/pages/isphone/isphone",
                });

              } else if (res.cancel) {

              }
            }
          })
        } else {
          info.avatar = that.data.avatar_big; //头像
          info.name = that.data.nickName; //名字
          info.gender = that.data.gender; //性别
          info.school = that.data.school; //学校
          info.tel = that.data.tel; //手机号码
          info.schoolYear = that.data.schoolYear;//大学学年
          let str = JSON.stringify(info)
          //传递个人信息
          wx.navigateTo({ url: 'personalInfo/personalInfo?info='+ str}); 
        }
      },
      fail: (err) => {
        app.login("/pages/mine/mine");
      }
    })

  },
  reBuy: function (e) {  //option跳转
    let Type = e.currentTarget.dataset.type
    switch(Type){
      case "发布":
        wx.navigateTo({ url: 'reBuy/reBuy?type=' + Type }); 
        break;
      case "求购":
        wx.navigateTo({ url: 'reBuy/reBuy?type=' + Type });
        break;
      case "意见反馈":
        wx.navigateTo({ url: 'feedback/feedback'});
        break;
      case "评论":
        wx.navigateTo({ url: 'comment/comment'});
        break;
      case "消息":
        wx.navigateTo({ url: 'myNews/myNews' });
        break;
    }
  },
  isPhone:function(){
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        wx.hideToast();
        if (!res.data.isPhone) {
          wx.showModal({
            title: '温馨提示',
            content: '尊敬的小村大优用户，欢迎您使用我们的平台，请您验证手机号码解锁更多功能。',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: "/pages/isphone/isphone",
                });
              } else if (res.cancel) {
                wx.redirectTo({
                  url: '/pages/index/index',
                })
              }
            }
          })
        }else{
        }
      },
      fail: (err) => {
        app.login("/pages/mine/mine");
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask:true
    });
    tabbar.isRead(that);
    that.isPhone();
    wx.getStorage({
      key: 'token',
      success: function(res) {
        // console.log(res)
        that.setData({  
          avatar_big: res.data.headPortrait,//微信头像
          nickName: res.data.name, //微信名字
          gender: res.data.gender,//性别 0 未知 1 男 2 女
          school: res.data.school,  //学校
          tel: res.data.phone,    //手机号码
          schoolYear: res.data.schoolYear,  //学年
          jzdh: false
        })
        wx.hideToast();  //取消加载动画
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
    if (this.data.update){
      console.log("更新用户信息")
      var that = this;
      wx.getStorage({
        key: 'token',
        success: function (res) {
          that.setData({
            avatar_big: res.data.headPortrait,//微信头像
            nickName: res.data.name, //微信名字
            gender: res.data.gender,//性别 0 未知 1 男 2 女
            school: res.data.school,  //学校
            tel: res.data.phone,    //手机号码
            schoolYear: res.data.schoolYear,  //学年
            // jzdh: false
          })
          wx.hideToast();  //取消加载动画
        },
      })
    }
    tabbar.isRead(this);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (this.data.avatar_big == ""){
      var that = this;
      wx.getStorage({
        key: 'token',
        success: function (res) {
          that.setData({
            avatar_big: res.data.headPortrait,//微信头像
            nickName: res.data.name, //微信名字
            gender: res.data.gender,//性别 0 未知 1 男 2 女
            school: res.data.school,  //学校
            tel: res.data.phone,    //手机号码
            schoolYear: res.data.schoolYear,  //学年
            // jzdh: false
          })
          wx.hideToast();  //取消加载动画
        },
      })
    }
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