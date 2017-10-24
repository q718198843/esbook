// pages/list/list.js
var shopList = require('../shopList/shopList.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cate:"",
    category_list: [],
    tabAc: 0,
    num: 0,
    listLoop:1,
    listType:false,
    listPrice:false,
    listTime:false,
    listLoop:[],
    page:1,
    val:"",
    OrName:"",
    OrEsc:'',
    priceNum:0,
    timeNum:0,
    typesId:""
  },
  submit: function (e) { //获取formID 备用
    shopList.formSubmit(e)
  },
  search: function () {  //跳转到搜索页
    wx.navigateBack({
      delta:1
    })
  },
  cateTab: function (e) { //类别切换
    let that = this;
    let id = e.currentTarget.dataset.id;
    that.setData({
      num: e.currentTarget.dataset.index,
      page: 1,
      typesId: id
    })
    that.queryList()
  },
  priceTab:function(e){ //按价钱筛选
    let that = this;
    let index = e.currentTarget.dataset.index;
    let OrEsc = ''
    if (index == 0) {
      OrEsc = "desc"
    } else {
      OrEsc = "ASC"
    }
    that.setData({
      priceNum: index,
      page: 1,
      OrEsc: OrEsc,
      OrName: 'price',
    })
    that.queryList()
  },
  timeTab: function (e) {  //按时间筛选
    let that = this;
    let index = e.currentTarget.dataset.index;
    let OrEsc = ''
    console.log(index)
if (index == 0){
    OrEsc = "desc"
    }else{
    OrEsc = "ASC"      
    }
    that.setData({
      timeNum: index,
      page:1,
      OrEsc: OrEsc,
      OrName:'create_time',
    })
    that.queryList()
  },
  others: function (e) {  //跳转到他人主页
    var id = e.currentTarget.dataset.id
    wx.getStorage({
      key: 'token',
      success: function (res) {
        if (res.data.isPhone) {
          shopList.others(id)
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '尊敬的小村大优用户，欢迎您使用我们的平台，请您验证手机号码解锁更多功能。',
            // showCancel: false,
            success: (res2) => {
              if (res2.confirm) {
                wx.navigateTo({
                  url: "/pages/isphone/isphone",
                });
              }
            }
          })
        }
      },
      fail: function (err) {
        wx.redirectTo({
          url: '/pages/mine/mine',
        });
      }
    })
  },
  detail: function (e) { //商品详情
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
  queryList: function (typesId){
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    that.setData({
      listType: false,
      listPrice: false,
      listTime: false
    })
    let objData = {
      page:that.data.page,
      rows:3,
      val:that.data.val
    }
    if (that.data.typesId != ''){
      objData.typesId = that.data.typesId
    }
    if (that.data.OrName != ''){
      objData.OrName = that.data.OrName
    }
    if (that.data.OrEsc != ''){
      objData.OrEsc = that.data.OrEsc
    }
    
    wx.request({
      url: app.data.Interface + "/index/queryList",
      data: objData,
      success: (res) => {
        var data = res.data.data.data;
        // console.log(objData)
        // console.log(res.data)
        wx.hideLoading()
        if (res.data.reCode == 201) {
          if (res.data.data.data == '') {
            wx.hideLoading();
            if (res.data.data.page > 1) {
              wx.showModal({
                title: '提示',
                content: '已到底线，无数据了...',
                showCancel: false,
              })
            } else {
              wx.showModal({
                title: '提示',
                content: '该分类数据为空...',
                showCancel: false,
              })
            }

          } else {
            if (res.data.data.page > 1) {
              data.forEach(function (item) {
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

            wx.hideLoading();
          } 
        }else{
          wx.showModal({
            title: '警告',
            content: '数据错误',
            showCancel: false,
          })
        }
      },
      fail:(err) =>{
        wx.showModal({
          title: '警告',
          content: '服务器错误',
          showCancel: false,
          success: (res3) => {
            if (res3.confirm) {
              wx.reLaunch({
                url: '/pages/index/index',
              })
            }
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var searcData = options.searcData;
    that.setData({
      val: searcData
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({   //获取商品分类
      url: app.data.Interface + "/index/getType",
      data: {
        isAll: 0
      },
      success: (res) => {
        if (res.statusCode == 200) {
          res.data.data.forEach(function (item, index) {   //分类，加入状态变量
            that.data.category_list.push(item)
            that.data.category_list[index].state = false;
            that.data.category_list[0].state = true;
          })
          that.setData({
            category_list: that.data.category_list
          })
          wx.hideLoading()
        } else {
          wx.hideLoading()
          wx.showModal({
            title: '警告',
            content: '数据加载失败，请检查网络状况',
            showCancel: false,
            success: (res2) => {
              if (res2.confirm) {
                wx.reLaunch({
                  url: '/pages/index/index',
                })
              }
            }
          })
        }
      }
    })
    that.queryList();
  },
  listTab:function(event){  //类型详情切换事件
    var index = event.currentTarget.dataset.index;
    var _this = this;
    _this.setData({
      listTabNum:index
    })
    // console.log(index)
    // console.log(_this.data.listType)
    // console.log(_this.data.listPrice)
    switch (index){
      case "0": //显示隐藏详细类别排序
        if (_this.data.listType) {
          _this.setData({
            listType: false,
            listPrice: false,
            listTime: false
          })
        } else {
          _this.setData({
            listType: true,
            listPrice: false,
            listTime: false
          })
        }
        break;
      case "1":
        if (_this.data.listTime) {  //显示隐藏时间排序
          _this.setData({
            listType: false,
            listPrice: false,
            listTime: false
          })
        } else {
          _this.setData({
            listType: false,
            listPrice: false,
            listTime:true
          })
        }
        break;
      case "2":
        if (_this.data.listPrice) {  //显示隐藏价格排序
          _this.setData({
            listType: false,
            listPrice: false,
            listTime: false
          })
        } else {
          _this.setData({
            listType: false,
            listPrice: true,
            listTime: false
          })
        }
        break;
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
    let that = this
    that.setData({
      page: that.data.page + 1
    })
    that.queryList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})