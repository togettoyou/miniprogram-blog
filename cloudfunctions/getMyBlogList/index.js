/**
 * 根据openid得到博客(我的发布)
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
// 云函数入口函数
exports.main = async(event, context) => {
  var openid = event.openid

  const countResult = await db.collection('blog').count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('blog').orderBy('datetime', 'desc').where({
        openid: openid
      }).skip(i * MAX_LIMIT).limit(MAX_LIMIT)
      .get()
    tasks.push(promise)
  }
  const mybloginfo = (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })

  const tasks2 = []
  for (let i = 0; i < mybloginfo.data.length; i++) {
    const promise2 = await db.collection('user').where({
      openid: mybloginfo.data[i].openid
    }).get()
    tasks2.push(promise2)
  }
  const mybloguserinfo = (await Promise.all(tasks2)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })

  return {
    mybloginfo,
    mybloguserinfo
  }
}