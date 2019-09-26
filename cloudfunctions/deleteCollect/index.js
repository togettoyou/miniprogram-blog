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
  if (num != 0) {
    const tasks = []
    const promise = db.collection('collect').where({
      blogid: myblogid,
      openid: myopenid
    }).get()
    tasks.push(promise)
    const deleteidinfo = (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data),
        errMsg: acc.errMsg,
      }
    })
    await db.collection('collect').doc(deleteidinfo.data[0]._id).remove()
    const _ = db.command
    await db.collection('blog').doc(myblogid).update({
      data: {
        collectNum: _.inc(-1)
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