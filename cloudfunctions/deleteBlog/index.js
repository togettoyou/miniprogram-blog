// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  var myblogid = event.blogid
  await db.collection('blog').where({
    _id: myblogid
  }).remove()
  await db.collection('collect').where({
    blogid: myblogid
  }).remove()
  await db.collection('comment').where({
    blogid: myblogid
  }).remove()
  return {
    msg: 'ok'
  }
}