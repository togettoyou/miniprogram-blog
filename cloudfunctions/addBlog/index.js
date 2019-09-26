// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  var mycollectNum = 0
  var mycommentNum = 0
  var mydatetime = event.datetime
  var mycontent = event.content
  var myopenid = event.openid
  var mypicture = event.picture
  var mytitle = event.title
  try {
    return await db.collection('blog').add({
      data: {
        collectNum: mycollectNum,
        commentNum: mycommentNum,
        datetime: mydatetime,
        content: mycontent,
        openid: myopenid,
        picture: mypicture,
        title: mytitle
      }
    })
  } catch (e) {
    console.log(e)
  }
}