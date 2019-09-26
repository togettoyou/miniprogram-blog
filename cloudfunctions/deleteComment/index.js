// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  var commentid = event.commentid
  var myblogid = event.myblogid
  await db.collection('comment').doc(commentid).remove()
  const _ = db.command
  await db.collection('blog').doc(myblogid).update({
    data: {
      commentNum: _.inc(-1)
    }
  })
  return {
    msg: 'ok'
  }
}