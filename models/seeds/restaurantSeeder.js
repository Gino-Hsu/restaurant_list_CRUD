const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurant.json').results //載入種子資料

const db = require('../../config/mongoose')

// 連線成功
db.once('open', () => {
  // 建立種子資料
  Restaurant.create(restaurantList)
    .then(() => {
      console.log("restaurantSeeder done!")
      db.close()
    })
    .catch(error => console.log(error))
})