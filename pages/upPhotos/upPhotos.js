// pages/upPhotos/upPhotos.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animData:{},
    display:"none"
  },
  barcode:function(){
    var that = this
    wx.scanCode({    //扫描条码二维码
      success: (res) => {
        // wx.showLoading({});
        //扫描成功
        wx.showLoading({
          title: '扫描成功',
          mask:true
        })
        wx.request({
          url: app.data.Interface + "/index/getIsbn",
          data:{
            isbn: res.result
          },
          header: {
            'content-type': 'json' // 默认值
          },
          success:(res2) =>{
            console.log(res2)
            wx.hideLoading();
            if (res2.data.reCode == 201){
              let bookData = {
                bookName: res2.data.data.title,
                price: res2.data.data.price,
                image: res2.data.data.image
              }
              // console.log(res2.data.data)
              // console.log(bookData)
              // var reg = new RegExp("^[0-9]*$")
              // var val = res2.data.price
              // console.log(val.replace(/[^0-9]/ig, ""))
              bookData = JSON.stringify(bookData)
              wx.navigateTo({ url: '/pages/goodsDetails/goodsDetails?bookData=' + bookData})
            }else{
              wx.showModal({
                title: '提示',
                content: '我们好像暂时没有该本书的数据，试试拍摄照片上传吧~',
                showCancel: false,
                success: function (res) {
                  console.log("非书籍条形码")
                }
              })
            } 
          },
          fail:(err) =>{
            console.log(err)
            wx.showModal({
              title: '警告',
              content: '服务器错误',
              showCancel: false,
              success: function (res) {
            
              }
            })
          }
        })
      },
      fail:(err) => {
        //扫描失败  取消扫描
      }
    })
  },
  upPhoto:function(){ //打开底部选择图片选项
    var that = this;
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
      transformOrigin: "50% 50%"
    })
    this.animation = animation;
    animation.bottom("23.4rpx").step()
    this.setData({
      animData: animation.export(),
      display:"block"
    })
  },
  close:function(){   //关闭底部选择图片选项
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
      transformOrigin: "50% 50%"
    })
    this.animation = animation;
    animation.bottom("-500rpx").step()
    this.setData({
      display:"none",
      animData: animation.export(),
    })
  },
  photo:function(e){ //从相册中选取照片
    let Ptype = e.currentTarget.dataset.type
    wx.chooseImage({
      count: 5, // 选择图片数量
      sizeType: ['compressed'], // 可以指定是original原图还是compressed压缩图，默认二者都有
      sourceType: [Ptype], // 可以指定来源是album 相册还是camera相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        wx.navigateTo({ url: '/pages/goodsDetails/goodsDetails?images=' + res.tempFilePaths})
      },
      fail:function(err){
        console.log("图片选择失败")       
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.close()
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