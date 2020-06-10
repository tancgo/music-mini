// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const rp = require('request-promise')
const URL = 'http://musicapi.xiecheng.live/personalized'
const playlistCollection = db.collection('playlist')

// 云函数入口函数
exports.main = async(event, context) => {
  const palylist = await rp(URL).then(res => {
    return JSON.parse(res).result
  })
  
  for (let i = 0, len = palylist.length; i < len; i++) {
    await playlistCollection.add({
      data: {
        ...palylist[i],
        createTime: db.serverDate()
      }
    }).then((res) => {
      console.log('插入成功')
    }).catch((err) => {
      console.log('插入失败')
    })
  }
}