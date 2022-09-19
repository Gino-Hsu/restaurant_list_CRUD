const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurant.json').results //載入種子資料

mongoose.connect(process.env.MONGODB_restaurant_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// 取得資料庫連線資料
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
  // 建立種子資料
  Restaurant.create(restaurantList)
    .then(() => {
      console.log("restaurantSeeder done!")
      db.close()
    })
    .catch(error => console.log(error))
})