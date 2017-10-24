// pages/mine/input/input.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    place:"请输入用户名",
    Itype:"",
    id:"",
    kong:""
  },
  submit:function(e){ //提交
    let Type = this.data.id
    let pages = getCurrentPages();
    let strings = e.detail.value[Type]
    function isNull(str) {
      if (str == "") return true;
      var regu = "^[ ]+$";
      var re = new RegExp(regu);
      return re.test(str);
    }
    if (strings.replace(/(^s*)|(s*$)/g, "").length == 0 || strings.length == 0 || isNull(strings)){
        wx.showModal({
          title: '提示',
          content: '用户名至少要有一个非空格字符',
          showCancel: false,
        })
        this.setData({
          kong: ""
        })
        return false
    }
    let prevPage = pages[pages.length - 2];
    if (Type == "name" || Type =="schoolYear"){  //提交名字或者学年
      prevPage.setData({
        mydata: { [Type]: e.detail.value[Type] }
      })
      wx.navigateBack({
        delta: Type
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  //根据传入参数 判断当前页面处理什么数据
    let title = "";
    var that = this;
    switch (options.type){
      case "name":
        title = "用户名"
        that.setData({
          place:"请输入用户名",
          Itype:"text",
          id:"name"
        })
        // console.log("name");
        break;
      case "schoolYear":
        title = "大学学年"
        that.setData({
          place: "请输入大学学年",
          Itype:"number",
          id:"schoolYear"
        })
        // console.log("schoolYear");
        break;
    }
    wx.setNavigationBarTitle({
      title: title
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