// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  var myavatarUrl = event.avatarUrl
  var mynickName = event.nickName
  var myopenid = event.openid
  try {
    return await db.collection('user').doc(myopenid).set({
      data: {
        avatarUrl: myavatarUrl,
        nickName: mynickName,
        openid: myopenid
      }
    })
  } catch (e) {
    console.log(e)
  }
}