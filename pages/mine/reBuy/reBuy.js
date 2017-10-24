// pages/mine/reBuy/reBuy.js
var shopList = require('../../shopList/shopList.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:[],
    sell:true,
    delBtnWidth:304,
    jzdh: true,
    current:"",
    reBuy:"sell",
    page:1,
    rows:3,
    b_img:'background-image: url("/images/tabbar/12@2x.png")'
  },
    //触摸开始
  touchS: function (e) {
    //判断是否只有一个触摸点
    if (e.touches.length == 1) {
      this.setData({
        //记录触摸起始位置的X坐标
        startX: e.touches[0].clientX
      });
      // console.log("起点坐标" + e.touches[0].clientX)
    }
  },
  //触摸时触发，手指在屏幕上每移动一次，触发一次   触摸移动
  touchM: function (e) {
    var that = this
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
      transformOrigin: "50% 50%"
    })
    this.animation = animation;

    if (e.touches.length == 1) {
      //记录触摸点位置的X坐标
      var moveX = e.touches[0].clientX;
      //计算手指起始点的X坐标与当前触摸点的X坐标的差值
      var disX = that.data.startX - moveX;
      //delBtnWidth 为右侧按钮区域的宽度
      var delBtnWidth = that.data.delBtnWidth
      // console.log("d"+disX);
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        animation.left("23.4rpx").step()
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        // txtStyle = "left:-" + disX + "rpx";
        animation.left(-disX + "rpx").step()
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          // txtStyle = "left:-" + delBtnWidth + "rpx";
          animation.left(-delBtnWidth + "rpx").step()
        }
      }
      //获取手指触摸的是哪一个item
      var index = e.currentTarget.dataset.index;
      var list = that.data.item;
      //将拼接好的样式设置到当前item中
      // console.log(list)
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        item: list,
        animData: animation.export(),
        aa: index
      });
    }
  },
  // 触摸结束
  touchE: function (e) {
    var that = this
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
      transformOrigin: "50% 50%"
    })
    this.animation = animation;
    if (e.changedTouches.length == 1) {
      //手指移动结束后触摸点位置的X坐标
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = that.data.startX - endX;
      var delBtnWidth = that.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? animation.left(-delBtnWidth + "rpx").step() : animation.left("23.4rpx").step();
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = that.data.item;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        item: list,
        animData: animation.export(),
        aa: index
      });
      // console.log(this.data.animData)
    }
  },
  upShop:function(e){
    let ev = e.currentTarget.dataset;
    let that = this;
    wx.showModal({
      content: '确定重新上架',
      success: function (res) {
        if (res.confirm) {
          wx.getStorage({
            key: 'token',
            success: function (res) {
              wx.request({
                url: app.data.Interface + "/books/updow",
                data: {
                  userId: res.data.id,
                  token: res.data.token,
                  type: "up",
                  booksId: ev.id
                },
                success: (res2) => {
                  if (res2.statusCode == 200) {
                    wx.redirectTo({
                      url: 'reBuy?type=' + that.data.current
                    })
                  }
                }
              })
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  detail:function(e){
    let ev = e.currentTarget.dataset;
    let that = this;
    if(ev.type == "下架"){
      wx.showModal({ 
      content: '确定下架', 
      success: function (res) { 
        if (res.confirm) { 
            wx.getStorage({
            key: 'token',
            success: function(res) {
              wx.request({
                url: app.data.Interface + "/books/updow",
                data:{
                  userId:res.data.id,
                  token:res.data.token,
                  type:"dow",
                  booksId:ev.id
                },
                success: (res2) =>{
                  if (res2.statusCode == 200){
                    wx.redirectTo({
                      url: 'reBuy?type=' + that.data.current
                    })
                  }
                }
              })
            },
          })
        } else if (res.cancel) { 
          console.log('用户点击取消') 
        } 
        } 
      })

    }else{
      var id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/editshop/editshop?id=' + id,
      })
    }
    
  },
  shopxq:function(e){
    var id = e.currentTarget.dataset.id;
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
  buy:function(e){
    var id = e.currentTarget.dataset.id;
    let that = this;
    wx.navigateTo({
      url: '/pages/editBuy/editBuy?id=' + id,
    })
  },
  getDataFromServer: function (Type){
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.getStorage({
      key: 'token',
      success: function (res) {
        wx.request({
          url: app.data.Interface + "/books/queryMyList",
          data: {
            userId: res.data.id,
            token: res.data.token,
            bookTypes: that.data.reBuy,
            page: that.data.page,
            rows: that.data.rows
          },
          success: (res2) => {
            console.log(res2)
            if (res2.statusCode == 200) {
              res2.data.data.data.forEach(function(item){
                that.data.item.push(item)
              })
              that.setData({
                item: that.data.item,
                jzdh: false,
                current: Type
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
    let title = "";
    var that = this;
    wx.showLoading({
      title: '正在加载..',
    })
    if (options.type == "发布"){
      title="我发布的";
      that.setData({
        sell:false,
        reBuy:"sell"
      })
      
    }else{
      title = "我求购的";
      that.setData({
        reBuy:"buy"
      })
    }
    that.getDataFromServer(options.type);
    wx.setNavigationBarTitle({
      title: title
    });
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
  onReachBottom: function (e) {
    let that = this;
    console.log(e)
    that.setData({
      page:that.data.page +1
    })
    that.getDataFromServer(that.data.current);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})