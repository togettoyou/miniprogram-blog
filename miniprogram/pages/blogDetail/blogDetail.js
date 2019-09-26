// pages/blogDetail/blogDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogdata: {},
    bloguserdata: {},
    commentinfo: {},
    commentuserinfo: {},
    isHavaCollect: false,
    myopenid: wx.getStorageSync("openid")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    self = this
    self.setData({
      blogdata: JSON.parse(options.blogdata),
      bloguserdata: JSON.parse(options.bloguserdata)
    })
    wx.setNavigationBarTitle({
      title: JSON.parse(options.blogdata).title
    })
    wx.cloud.callFunction({
      name: 'getComment',
      data: {
        blogid: JSON.parse(options.blogdata)._id
      },
      success: function(res) {
        self.setData({
          commentinfo: res.result.commentinfo.data,
          commentuserinfo: res.result.commentuserinfo.data
        })
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
    wx.cloud.callFunction({
      name: 'isCollect',
      data: {
        blogid: self.data.blogdata._id,
        openid: wx.getStorageSync("openid")
      },
      success: function(res) {
        self.setData({
          isHavaCollect: res.result.isHavaCollect
        })
        console.log(res.result.isHavaCollect)
      },
      fail: function(res) {
        console.log(res)
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
  onShow: function() {
    self = this
    wx.cloud.callFunction({
      name: 'getComment',
      data: {
        blogid: self.data.blogdata._id
      },
      success: function(res) {
        self.setData({
          commentinfo: res.result.commentinfo.data,
          commentuserinfo: res.result.commentuserinfo.data
        })
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
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
  onCollect: function() {
    self = this
    console.log(self.data.isHavaCollect)
    wx.showLoading({
      title: '加载中',
    })
    if (self.data.isHavaCollect == true) {
      wx.cloud.callFunction({
        name: 'deleteCollect',
        data: {
          blogid: self.data.blogdata._id,
          openid: wx.getStorageSync("openid")
        },
        success: function(res) {
          console.log(res)
          if (res.result.msg == 'ok') {
            wx.showToast({
              icon: 'none',
              title: '取消收藏成功',
            })
            self.setData({
              isHavaCollect: false
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
    } else {
      wx.cloud.callFunction({
        name: 'addCollect',
        data: {
          blogid: self.data.blogdata._id,
          openid: wx.getStorageSync("openid")
        },
        success: function(res) {
          console.log(res)
          if (res.result.msg == 'ok') {
            wx.showToast({
              icon: 'none',
              title: '收藏成功',
            })
            self.setData({
              isHavaCollect: true
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '收藏失败',
            })
          }
        },
        fail: function(res) {
          console.log(res)
        }
      })
    }

  },
  writecomment: function() {
    self = this
    wx.navigateTo({
      url: '../writecomment/writecomment?blogid=' + self.data.blogdata._id
    });
  },
  delcomment: function(event) {
    self = this
    var commentid = event.currentTarget.dataset.id
    var blogid = this.data.blogdata._id
    var commentindex = event.currentTarget.dataset.commentindex
    wx.showModal({
      title: '提示',
      content: '确认删除这条评论?',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          })
          wx.cloud.callFunction({
            name: 'deleteComment',
            data: {
              commentid: commentid,
              myblogid: blogid
            },
            success: function(res) {
              console.log(res)
              if (res.result.msg == 'ok') {
                wx.showToast({
                  icon: 'none',
                  title: '删除成功',
                })
                self.data.commentinfo.splice(commentindex, 1)
                self.data.commentuserinfo.splice(commentindex, 1)
                self.setData({
                  commentinfo: self.data.commentinfo,
                  commentuserinfo: self.data.commentuserinfo
                })
              } else {
                wx.showToast({
                  icon: 'none',
                  title: '删除失败',
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