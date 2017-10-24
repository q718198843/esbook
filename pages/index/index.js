//index.js
//获取应用实例
var shopList = require('../shopList/shopList.js');
var tabbar = require('../template/tabbar/tabbar.js');
var app = getApp()
Page({
  data: {
    sc:false,
    bannerimgUrls: [

    ],  //banner 图片
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    indicatorColor:"#ffffff",
    indicatorActiveColor:"#34C289",
    category_list:[], //商品分类
    num:0,
    tabAc:{
      sw:0,
      isRead:false
    },
    listLoop:"", //首页商品列表
    jzdh: true,
    page:1,
    rows:3,
    bookTypes:"sell",
    typesId:0,
    orderName:"create_time",
    orderEsc:"desc",
  },
  queryList:function(){
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.data.Interface + "/index/queryList",
      data:{
        page: that.data.page,
        rows:that.data.rows,
        bookTypes: that.data.bookTypes,
        typesId: that.data.typesId,
        // orderName: that.data.orderName,
        // orderEsc: that.data.orderEsc
      },
      success: (res) =>{
        console.log(res)
        if (res.statusCode == 200){
          if (res.data.data.data == ''){
            wx.hideLoading();
            if (res.data.data.page > 1){
              wx.showModal({
                title: '提示',
                content: '已到底线，无数据了...',
                showCancel: false,
              })
            }else{
              // wx.showModal({
              //   title: '提示',
              //   content: '该分类数据为空...',
              //   showCancel: false,
              // })
              that.setData({
                listLoop:""
              })
            }
            
          }else{
            if (res.data.data.page > 1) {
              res.data.data.data.forEach(function (item) {
                that.data.listLoop.push(item)
              })
              that.setData({
                listLoop: that.data.listLoop
              })
            } else {
              that.setData({
                listLoop: res.data.data.data
              })
            }
            that.setData({
              listLoopKong: false
            })
            // console.log(that.data.listLoop)
            wx.hideLoading();
          } 
        }else{
          wx.hideLoading();
          wx.showModal({
            title: '警告',
            content: '加载失败，请检查网络环境',
            showCancel: false,
          })
        }
        
      },
      fail: (err) =>{
        wx.hideLoading();
        wx.showModal({
          title: '警告',
          content: '加载失败，请检查网络环境',
          showCancel: false,
        })
      }
    })
  },
  others:function(e){  //跳转到他人主页
    var id = e.currentTarget.dataset.id
    wx.getStorage({
      key: 'token',
      success: function(res) {
        if (res.data.isPhone){
            shopList.others(id)
        }else{
          wx.showModal({
            title: '温馨提示',
            content: '尊敬的小村大优用户，欢迎您使用我们的平台，请您验证手机号码解锁更多功能。',
            // showCancel: false,
            success: (res2) =>{
              if (res2.confirm){
                wx.navigateTo({
                  url: "/pages/isphone/isphone",
                });
              }
            }
          })
        }
      },
      fail:function(err){
        wx.redirectTo({
          url: '/pages/mine/mine',
        });
      }
    })
  },
  submit:function(e){
    shopList.formSubmit(e)
  },
  detail:function(e){ //商品详情
    var id = e.currentTarget.dataset.id
    wx.getStorage({
      key: 'token',
      success: function (res) {
        shopList.detail("商品", id)
      },
      fail: function (err) {
        wx.redirectTo({
          url: '/pages/mine/mine',
        });
      }
    })
  },
  //事件处理函数
  tabbarTab: function (event) {   //底部tabbar切换函数
    switch (event.currentTarget.dataset.index){
      case "首页": return;
      break;
      case "上传": 
        var sc = this.data.sc;
        this.setData({
            sc:true
        })
      break;
      case "我的": 
        wx.redirectTo({
          url: '/pages/mine/mine',
        });
      break;
    }
  },
  search:function(){  //跳转到搜索页
    wx.navigateTo({ url: '/pages/search/search'});
  },
  delSc:function(){  //关闭上传页
    var sc = this.data.sc;
    this.setData({
      sc: false
    })
  },
  sell:function(){  //出售商品跳转
    wx.getStorage({
      key: 'token',
      success: function(res) {
        //判断是否绑定手机
        if (res.data.isPhone) {
          wx.navigateTo({ url: '/pages/upPhotos/upPhotos' })
        }else{
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
      fail:(err) => {
        app.login("/pages/index/index")
      }
    })
  },
  wantBuy:function(){ //求购商品跳转
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
  cateTab:function(e){ //类别切换
    let that = this;
    that.setData({
      num:e.currentTarget.dataset.index,
      typesId: e.currentTarget.dataset.id,
      page:1
    })
    that.queryList()
  },
  activity:function(e){ //轮播活动跳转
    let Type = e.currentTarget.dataset;
    //轮播类型 external(外部链接), activity(活动),details(书详情页) 注：根据不同类型跳转不同界面
    switch (Type.bannertype){
      case "external":
        wx.navigateTo({ url: '/pages/getPage/getPage?id=' + Type.id }) 
        break;
      case "activity":
        wx.navigateTo({ url: '/pages/activity/activity?id=' + Type.id}) 
        break;
      case "details":
        wx.getStorage({
          key: 'token',
          success: function (res) {
            shopList.detail("商品", Type.id)
          },
          fail: function (err) {
            wx.redirectTo({
              url: '/pages/mine/mine',
            });
          }
        })
        break;
    }
  },
  sellBuy:function(e){   //出售购买 数据切换
    console.log(e.currentTarget.dataset.tab)
    this.setData({
      bookTypes: e.currentTarget.dataset.tab,
      page:1
    })
    this.queryList()
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    let that = this;
    wx.showLoading({
      title: '加载中',
      mask:true
    });
    tabbar.isRead(that);
    wx.request({
      url: app.data.Interface+'/index/getIndex', //首页数据接口
      success: function (res) {
        if (res.data.reCode == 201){
          let data = res.data.data;
          // console.log(data)
          data.banner.forEach(function (item) {  //banner 图片
            that.data.bannerimgUrls.push(item)
          })
          data.booksType.forEach(function (item) {  //首页分类
            that.data.category_list.push(item)
          })
          that.setData({
            bannerimgUrls: that.data.bannerimgUrls,
            category_list: that.data.category_list,
            // listLoop: data.books,
            page:1,
            jzdh: false
          })
          that.queryList();
          wx.hideToast()
        }else{
          wx.hideLoading()
          wx.showModal({
            title: '警告',
            content: "数据错误，请检查网络并重启小程序",
            showCancel: false,
          })
        }
        
      },
      fail:function(err){
        wx.hideLoading()
        wx.showModal({
          title: '警告',
          content: "服务器错误，请联系客服人员",
          showCancel: false,
        })
      }
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
   var that = this;
   tabbar.isRead(that);
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    that.setData({
      page:that.data.page + 1
    })
    that.queryList()
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
