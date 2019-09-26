// pages/myCollect/myCollect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bloginfo: [],
    userinfo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    self = this
    wx.cloud.callFunction({
      name: 'getMyCollectList',
      data: {
        openid: wx.getStorageSync("openid")
      },
      success: function(res) {
        wx.stopPullDownRefresh()
        self.setData({
          bloginfo: res.result.collectBloginfo.data,
          userinfo: res.result.collectBlogUserinfo.data
        })
      },
      fail: function(res) {
        wx.stopPullDownRefresh()
        console.log(res.errMsg)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
  },
  onRemoveCollect: function(event) {
    var blogdata = event.currentTarget.dataset.item
    var blogindex = event.currentTarget.dataset.index
    console.log(blogindex)
    self = this


    wx.showModal({
      title: '提示',
      content: '确认取消收藏?',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          })
          wx.cloud.callFunction({
            name: 'deleteCollect',
            data: {
              blogid: blogdata._id,
              openid: wx.getStorageSync("openid")
            },
            success: function(res) {
              console.log(res)
              if (res.result.msg == 'ok') {
                wx.showToast({
                  icon: 'none',
                  title: '取消收藏成功',
                })
                self.data.bloginfo.splice(blogindex, 1)
                self.data.userinfo.splice(blogindex, 1)
                self.setData({
                  bloginfo: self.data.bloginfo,
                  userinfo: self.data.userinfo
                })
              } else {
                wx.showToast({
                  icon: 'none',
                  title: '取消收藏失败',
                })
              }
            },
            fail: function(res) {
              console.log(res)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })


  }
})