// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  var myblogid = event.blogid
  var myopenid = event.openid
  var mycommentdate = event.commentdate
  var mycontent = event.content
  const _ = db.command
  await db.collection('blog').doc(myblogid).update({
    data: {
      commentNum: _.inc(1)
    }
  })
  await db.collection('comment').add({
    data: {
      blogid: myblogid,
      openid: myopenid,
      commentdate: mycommentdate,
      content: mycontent
    }
  })
  return {
    msg: 'ok'
  }
}