// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  var myblogid = event.blogid
  var myopenid = event.openid
  const countResult = await db.collection('collect').where({
    blogid: myblogid,
    openid: myopenid
  }).count()
  const num = countResult.total
  if (num == 0) {
    return {
      isHavaCollect: false
    }
  } else
    return {
      isHavaCollect: true
    }
}