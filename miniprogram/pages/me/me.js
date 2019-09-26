// pages/me/me.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../../images/user-unlogin.png',
    nickName: "点击头像授权登录",
    userInfo: {},
    logged: false,
    blogNum: 0,
    collectNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    self = this
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName,
                userInfo: res.userInfo,
                logged: true
              })
              this.logged = true
            }
          })
          //查询发布和收藏数量
          wx.cloud.callFunction({
            name: 'getMyBlogAndCollectNum',
            data: {
              openid: wx.getStorageSync("openid")
            },
            success: function(res) {
              self.setData({
                blogNum: res.blogNum,
                collectNum: res.collectNum
              })
            },
            fail: function(res) {
              console.log(res.errMsg)
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    self = this
    // 调用云函数
    if (!this.logged && e.detail.userInfo) {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log('[云函数] [login] user openid: ', res.result.openid)
          this.logged = true
          wx.setStorageSync('openid', res.result.openid)
          wx.getUserInfo({
            success: res => {
              const myavatarUrl = res.userInfo.avatarUrl
              const mynickName = res.userInfo.nickName
              wx.cloud.callFunction({
                name: 'addUser',
                data: {
                  avatarUrl: myavatarUrl,
                  nickName: mynickName,
                  openid: wx.getStorageSync("openid")
                },
                success: function(res) {
                  console.log(res)
                  self.onLoad();
                  self.onShow();
                },
                fail: function(res) {
                  console.log(res)
                  if (getCurrentPages().length != 0) {
                    //刷新当前页面的数据
                    getCurrentPages()[getCurrentPages().length - 1].onLoad()
                  }
                }
              })
            }
          })
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
          if (getCurrentPages().length != 0) {
            //刷新当前页面的数据
            getCurrentPages()[getCurrentPages().length - 1].onLoad()
          }
        }
      })
    }
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
    //查询发布和收藏数量
    wx.cloud.callFunction({
      name: 'getMyBlogAndCollectNum',
      data: {
        openid: wx.getStorageSync("openid")
      },
      success: function(res) {
        self.setData({
          blogNum: res.result.blogNum,
          collectNum: res.result.collectNum
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
  myblog: function(event) {
    wx.navigateTo({
      url: '../myBlog/myBlog'
    });
  },
  mycollect: function(event) {
    wx.navigateTo({
      url: '../myCollect/myCollect'
    });
  },
  aboutBt: function() {
    wx.showToast({
      title: '关于',
    })
  },
  adviceBt: function() {
    wx.showToast({
      title: '意见反馈',
    })
  }
})