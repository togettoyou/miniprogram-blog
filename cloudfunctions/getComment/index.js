/**
 * 根据博客id得到评论信息
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
// 云函数入口函数
exports.main = async(event, context) => {
  var blogid = event.blogid
  // 先取出评论集合记录总数
  const countResult = await db.collection('comment').count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('comment').orderBy('commentdate', 'desc').where({
        blogid: blogid
      }).skip(i * MAX_LIMIT).limit(MAX_LIMIT)
      .get()
    tasks.push(promise)
  }
  const commentinfo = (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
  //评论的用户信息
  const tasks2 = []
  for (let i = 0; i < commentinfo.data.length; i++) {
    const promise2 = await db.collection('user').where({
      openid: commentinfo.data[i].openid
    }).get()
    tasks2.push(promise2)
  }
  const commentuserinfo = (await Promise.all(tasks2)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
  return {
    commentinfo,
    commentuserinfo
  }
}