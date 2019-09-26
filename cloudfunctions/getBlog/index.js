/**
 * 得到所有博客信息
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
// 云函数入口函数
exports.main = async(event, context) => {
  // 先取出集合记录总数
  const countResult = await db.collection('blog').count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('blog').orderBy('datetime', 'desc').skip(i * MAX_LIMIT).limit(MAX_LIMIT)
      .get()
    tasks.push(promise)
  }
  const bloginfo = (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
  const tasks2 = []
  for (let i = 0; i < bloginfo.data.length; i++) {
    const promise2 = await db.collection('user').where({
      openid: bloginfo.data[i].openid
    }).get()
    tasks2.push(promise2)
  }
  const userinfo = (await Promise.all(tasks2)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })

  // 等待所有
  return {
    bloginfo,
    userinfo
  }
}