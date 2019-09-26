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
    const _ = db.command
    await db.collection('blog').doc(myblogid).update({
      data: {
        collectNum: _.inc(1)
      }
    })
    await db.collection('collect').add({
      data: {
        blogid: myblogid,
        openid: myopenid
      }
    })
    return {
      msg: 'ok'
    }
  } else
    return {
      msg: 'error'
    }
}