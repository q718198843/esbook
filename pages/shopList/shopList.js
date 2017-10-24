// pages/template/shopList/shopList.js
var app = getApp()
function others(id) {
    // 传入用户ID
  wx.navigateTo({ url: '/pages/otherHome/otherHome?id=' + id });
}
function detail(text,id) {
  // 传入商品ID 和 用户 id 
  // console.log(text)
  wx.navigateTo({ url: '/pages/detail/Detail?text=' + text + '&id='+ id});
}
function formSubmit(e){
  let formID = e.detail.formId;
  
  wx.getStorage({
    key: 'token',
    success: function(res) {
      wx.request({
        url: app.data.Interface + "/index/addFromId",
        data:{
          userId:res.data.id,
          token:res.data.token,
          fromIds: formID
        },
        success: (res2) =>{
          if (res2.data.reCode == 201){
            console.log("formID"+res2.data.data)
          }else{
            console.log("接口失败")
          }
        }
      })
    },
  })
}
module.exports = {
  others: others,
  detail: detail,
  formSubmit: formSubmit
};
