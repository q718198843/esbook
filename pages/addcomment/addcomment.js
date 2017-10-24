// pages/addcomment/addcomment.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images:[],
    shopId:"",
    formId:"",
    Type:false,
    plId:"",
    userId:""
  },
  fabiao: function (imgs, comment){
    let that = this;
    let page = getCurrentPages();
    let url = "";
    wx.showLoading({
      title: that.data.Type + '提交中...',
    })
    if (that.data.Type == "评论"){
      url = "/books-comment/add";
    }else{
      url = "/books-comment/addComment"
    }
    wx.getStorage({
      key: 'token',
      success: function(res) {
        if(that.data.Type == "评论"){
          var data = {
            userId: res.data.id,
            token: res.data.token,
            booksId: that.data.shopId,
            content: comment,
            imgs: imgs,
            form_id: that.data.formId
          }
        }else{
          var data = {
            userId: res.data.id,
            token: res.data.token,
            booksCommentId: that.data.plId,
            content: comment,
            imgs: imgs,
            coverAppUserId: that.data.userId
          }
        }
        // wx.hideLoading()
        // console.log(data)
        // return false
        wx.request({
          url: app.data.Interface + url,
          data: data,
          success: (res2) =>{
            if (res2.data.reCode == 201){
              page.forEach(function (item, index) {
                if (!item.data.com) {
                  page[index].setData({
                    com: true
                  })
                  wx.navigateBack({
                    delta: index
                  })
                }
              })
            }else{
              wx.hideLoading()
              wx.showModal({
                title: '警告',
                content: '上传失败，请检查网络环境',
                showCancel: false,
              })
            }
          }
        })
      },
    })
  },
  upPhoto: function () {
    var _this = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let images = _this.data.images;
        let Photo = res.tempFilePaths;
        Photo.forEach(function (item) {
          images.push(item)
        })
        _this.setData({
          images: images
        })
      }
    })
  },
  previewImage: function (e) { //图片预览
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: this.data.images // 需要预览的图片http链接列表
    })
  },
  delImage: function (e) {  //删除图片
    let index = e.currentTarget.dataset.index;
    this.data.images.pop(index);
    this.setData({
      images: this.data.images
    })
  },
  submit:function(e){
    let that = this;
    let comment = e.detail.value.comment;
    that.setData({
      formId:e.detail.formId
    })
    let images = [];
    if (comment.length >=5){
      if (that.data.images != ''){
        that.data.images.forEach(function(item){
          wx.showLoading({
            title: '上传图片中...',
          })
          wx.uploadFile({
            url: app.data.Interface + '/image/save',
            filePath: item,
            name: 'file',
            success: (res1) => {
              console.log(res1)
              if (res1.statusCode == 200){
                wx.hideLoading();
                images.push(JSON.parse(res1.data).data);
                if (images.length == that.data.images.length){
                  that.fabiao(images.join(','), comment)
                }
              }else{
                wx.hideLoading();
                wx.showModal({
                  title: '警告',
                  content: '图片上传失败，请检查网络环境',
                  showCancel: false,
                })
              }
            },
            fail: (err) =>{
              wx.hideLoading();
              console.log(err)
              wx.showModal({
                title: '警告',
                content: '图片上传失败，请检查网络环境',
                showCancel: false,
              })
            }
          })
        })
      }else{
        that.fabiao('', comment)
      }
    }else{
      wx.showModal({
        title: '提示',
        content: '请输入至少五个字的评论',
        showCancel: false,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.id){
      this.setData({
        shopId: options.id,
        plId: options.plid,
        userId: options.userid,
        Type: options.type
      })
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})