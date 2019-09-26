// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const MAX_LIMIT = 100
// 云函数入口函数
exports.main = async(event, context) => {
  var openid = event.openid
  const countResult = await db.collection('blog').where({
    openid: openid
  }).count()
  const blogNum = countResult.total
  const countResult2 = await db.collection('collect').where({
    openid: openid
  }).count()
  const collectNum = countResult2.total
  return {
    blogNum,
    collectNum
  }
}