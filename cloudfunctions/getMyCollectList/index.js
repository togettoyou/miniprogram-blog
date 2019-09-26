/**
 * 根据openid得到收藏列表(我的收藏)
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
// 云函数入口函数
exports.main = async(event, context) => {
  var openid = event.openid
  const countResult = await db.collection('collect').count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('collect').where({
        openid: openid
      }).skip(i * MAX_LIMIT).limit(MAX_LIMIT)
      .get()
    tasks.push(promise)
  }
  const collectByOpenIdinfo = (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })

  const tasks2 = []
  for (let i = collectByOpenIdinfo.data.length - 1; i > -1; i--) {
    const promise2 = await db.collection('blog').where({
      _id: collectByOpenIdinfo.data[i].blogid
    }).get()
    tasks2.push(promise2)
  }
  const collectBloginfo = (await Promise.all(tasks2)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })


  const tasks3 = []
  for (let i = 0; i < collectBloginfo.data.length; i++) {
    const promise3 = await db.collection('user').where({
      openid: collectBloginfo.data[i].openid
    }).get()
    tasks3.push(promise3)
  }
  const collectBlogUserinfo = (await Promise.all(tasks3)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })

  return {
    collectBloginfo,
    collectBlogUserinfo
  }
}