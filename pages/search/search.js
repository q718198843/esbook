// pages/search/search.js
var WxSearch = require('../wxSearch/wxSearch.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr: []
  },
  // bindinput:function(){
  //   var that = this;
  //   that.setData({
  //     showSearch:true
  //   })
  // },
  // bindblur:function(){
  //   var that = this;
  //   that.setData({
  //     showSearch: false
  //   })
  // },
    //搜索
  wxSearchFn: function (e) {
    var that = this;
    let value = that.data.wxSearchData.value;
    if (value != undefined && value.length >= 1){
      wx.navigateTo({ url: '/pages/list/list?searcData=' + value });
    }else{
      wx.showModal({
        title: '警告',
        content: '搜索内容不能为空',
        showCancel: false,
      })
    }
    WxSearch.wxSearchAddHisKey(that);
    value = "";
    that.setData({
      wxSearchData: that.data.wxSearchData
    })
  },
  wxSearchInput: function (e) {
    var that = this
    // console.log(e.detail.value)
    // that.setData({
    //   arr:[]
    // })
    // wx.request({
    //   url: app.data.Interface + "/index/queryList",
    //   data:{
    //     val: e.detail.value
    //   },
    //   success: (res) =>{
    //     var data = res.data.data.data;
    //     data.forEach(function(item){
    //       that.data.arr.push(item.name)
    //     })
    //     that.setData({
    //       data:that.data.arr
    //     })
    //     WxSearch.initMindKeys(that.data.arr); 
    //   }
    // })
    WxSearch.wxSearchInput(e, that);
  },
  wxSerchFocus: function (e) {
    var that = this
    WxSearch.wxSearchFocus(e, that);
  },
  wxSearchBlur: function (e) {
    var that = this
    WxSearch.wxSearchBlur(e, that);
  },
  wxSearchKeyTap: function (e) {
    var that = this
    WxSearch.wxSearchKeyTap(e, that);
  },
  wxSearchDeleteKey: function (e) {
    var that = this
    WxSearch.wxSearchDeleteKey(e, that);
  },
  wxSearchDeleteAll: function (e) {
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function (e) {
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //初始化的时候渲染wxSearchdata 第二个为你的search高度
    //热门搜索关键词
    WxSearch.init(that, 43, []);
    //搜索的数据
    // WxSearch.initMindKeys(that.data.arr); 
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