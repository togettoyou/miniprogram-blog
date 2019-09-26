Page({

  /**
   * 页面的初始数据
   */
  data: {
    bloginfo: {},
    userinfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    self = this
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'getBlog',
      data: {},
      success: function(res) {
        wx.stopPullDownRefresh()
        wx.hideLoading()
        self.setData({
          bloginfo: res.result.bloginfo.data,
          userinfo: res.result.userinfo.data
        })
      },
      fail: function(res) {
        wx.stopPullDownRefresh()
        wx.hideLoading()
        console.log(res.errMsg)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  viewItem: function(event) {
    var item = event.currentTarget.dataset.item
    var blogdata = JSON.stringify(item)

    var user = event.currentTarget.dataset.user
    var bloguserdata = JSON.stringify(user)
    wx.navigateTo({
      url: '../blogDetail/blogDetail?blogdata=' + blogdata + '&bloguserdata=' + bloguserdata
    });
  }
})