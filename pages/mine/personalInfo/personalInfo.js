// pages/personalInfo/personalInfo.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:"",
    animData: {},
    display: "none",
    mydata:"",
    bol:true,
    bot0:"从相册中选",
    bot1:"拍照",
    // majorArr:["大学院系一","大学院系二","大学院系三","大学院系四"],
    // major: "大学院系一",
    school:[
      {
        id: "4b27a962b117455e88e27dcf7cc56f20",
        name:"UC Davis"
      }
    ],
    schoolYear: [
      {
        id: "1",
        name: "大一"
      },
      {
        id: "2",
        name: "大二"
      },
      {
        id: "3",
        name: "大三"
      },
      {
        id: "4",
        name: "大四及以上"
      },
      {
        id: "5",
        name: "研究生"
      },
      {
        id: "6",
        name: "其他"
      },
    ],
    multiIndex:[0,0],
    update:false
  },
  schoolYear:function(e){ //修改学年
    console.log(e)
    var that = this;
    that.data.info.schoolYear = that.data.schoolYear[e.detail.value].name;
    that.updateUser("schoolYear", that.data.schoolYear[e.detail.value].name)
    that.setData({
      info: that.data.info
    })
  },
  updateUser:function(key,val){
      let data = {};
      data[key] = val;
      let that = this;
      wx.showLoading({
        title: '正在更改资料..',
        mask:true
      })
      wx.getStorage({
        key: 'token',
        success: function(res) {
          var userData = res.data;
          data.userId = res.data.id;
          data.token = res.data.token
          wx.request({
            url: app.data.Interface + "/app-user/updateUser",
            data: data,
            success: (res2) =>{
              console.log(res2)
              if (res2.statusCode == 200){
                userData[key] = val;
                if (key == "schoolId"){
                  userData.school = that.data.info.school
                }
                wx.setStorage({
                  key: 'token',
                  data: userData,
                  success:(res3) =>{
                    console.log(res3);
                    that.setData({
                      update:true
                    })
                    wx.hideLoading();
                  }
                })
              } 
            }
          })
        },
      })
  },
  upPhoto: function (e) { //打开底部选择图片选项
    var that = this;
    if (e.currentTarget.dataset.bot == 'sex'){
      that.setData({
        bol: false,
        bot0: "男",
        bot1: "女"
      })
    }else{
      that.setData({
        bol: true,
        bot0: "从相册中选",
        bot1: "拍照"
      })
    }
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
      transformOrigin: "50% 50%"
    })
    this.animation = animation;
    animation.bottom("23.4rpx").step()
    this.setData({
      animData: animation.export(),
      display: "block"
    })
  },
  sex:function(e){  //性别选择

    if (e.currentTarget.dataset.type == '男'){
      this.data.info.gender = 1;
    }else{
      this.data.info.gender = 2;
    }
    this.updateUser("gender", this.data.info.gender)
    this.setData({
      info:this.data.info
    })
    this.close();
  },
  PickerChangeSchool:function(e){// 选择的学校
    this.data.info.school = this.data.school[e.detail.value].name;
    var id = this.data.school[e.detail.value].id
    this.setData({
      info: this.data.info
    })
    this.updateUser("schoolId",id)
    console.log(this.data.info)
  },
  // bindPickerChange:function(e){  //院系选择
  //   let index = e.detail.value;
  //   this.setData({
  //     major: this.data.majorArr[index]
  //   })
  // },
  close: function () {   //关闭底部选择图片选项
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
      transformOrigin: "50% 50%"
    })
    this.animation = animation;
    animation.bottom("-500rpx").step()
    this.setData({
      display: "none",
      animData: animation.export(),
    })
  },
  photo: function (e) { //从相册中选取照片
  var that = this;
  let Ptype = e.currentTarget.dataset.type;
    wx.chooseImage({
      count: 1, // 选择图片数量
      sizeType: ['original'], // 可以指定是original原图还是compressed压缩图，默认二者都有
      sourceType: [Ptype], // 可以指定来源是album 相册还是camera相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.close(); //执行关闭
        wx.showLoading({
          title: '正在上传头像..',
          mask: true
        })
        wx.uploadFile({
          url: app.data.Interface + '/image/save',
          filePath: res.tempFilePaths[0],
          name: 'name',
          success: (res2) =>{
            if (res2.statusCode == 200){
              that.updateUser("headPortrait", JSON.parse(res2.data).data);
              that.data.info.avatar = res.tempFilePaths[0];
              that.setData({
                info: that.data.info
              })
              wx.hideLoading()
            }else{
              wx.hideLoading()
              wx.showModal({
                content: '图片上传失败',
                showCancel: false,
                success: function (res) {
                }
              })
            }
          }
        })
      },
      fail: function (err) {
        console.log("图片选择失败")
      }
    })
  },
  modify:function(e){ //跳转到单独的设置页面 名字和学年
    wx.navigateTo({ url: '../input/input?type=' + e.currentTarget.dataset.type });
  },
  changePhone:function(){ //换绑手机号码
    wx.navigateTo({ url: '../changePhone/changePhone?Phone=' + this.data.info.tel });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      info: JSON.parse(options.info)
    })
    // console.log(JSON.parse(options.info))
    // wx.getStorage({  //获取学校信息
    //   key: 'token',
    //   success: function(res) {
    //     wx.request({
    //       url: app.data.Interface + "/school/getSchool",
    //       data: {
    //         userId: res.data.id,
    //         token:res.data.token,
    //         val:""
    //       },
    //       success: (res2) => {
    //         // console.log(res2)
    //         that.setData({
    //           school:res2.data.data.data
    //         })
    //         console.log(that.data.school)
    //       }
    //     })
    //   },
    // })
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
    let that = this;
      //接收修改过后的参数
    if (that.data.mydata.name && that.data.mydata.name !=""){ // 用户名
      // console.log(that.data.mydata.name)
      that.data.info.name = that.data.mydata.name;
      that.updateUser("name", that.data.mydata.name)
      that.setData({
        info:that.data.info
      })
      return;
    }
    // if (that.data.mydata.schoolYear && that.data.mydata.schoolYear !=''){ //大学学年 
    //   that.data.info.schoolYear = that.data.mydata.schoolYear;
    //   that.updateUser("schoolYear", that.data.mydata.schoolYear)
    //   that.setData({
    //     info: that.data.info
    //   })
    //   return;
    // }
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
    var page = getCurrentPages();
    if (this.data.update){
      page[0].setData({
        update: this.data.update
      })
    }
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