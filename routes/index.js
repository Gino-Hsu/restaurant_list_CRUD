// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 引用 Restaurant model
const Restaurant = require('../models/restaurant')
// 引入路由模組
const home = require('./modules/home') // 引入 home 模組程式碼
const restaurants = require('./modules/restaurants')
// 將網址結構符合 / 字串的 request 導向 home 模組 
router.use('/', home)
router.use('/restaurants', restaurants)

// search for name, category, rating
router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  const rating = req.query.rating
  return Restaurant.find()
    .lean()
    .then((restaurant) => {
      const restaurants = restaurant.filter(rest => {
        if (rest.rating >= Number(rating)) {
          return rest.name.toLowerCase().includes(keyword.toLocaleLowerCase()) || rest.category.includes(keyword)
        }
      })
      // can't find any restaurant by keyword
      if (restaurants.length === 0 && keyword.length !== 0) {
        res.render('error', {keyword, rating})
      } else {
        res.render('index', {restaurant: restaurants, keyword, rating})
      }
    })
    .catch(error => console.log(error))
})

//sort restaurant
router.get('/sort', (req, res) => {
  const sort = req.query.sort_type
  if (sort === 'asc' || sort === 'desc') {
    return Restaurant.find()
    .lean()
    .sort({_id: sort})
    .then((restaurant) => {
      res.render('index', {restaurant, sort})
    })
    .catch(error => console.log(error))
  } else if (sort === 'category') {
    return Restaurant.find()
    .lean()
    .sort({category: 'asc'})
    .then((restaurant) => {
      res.render('index', {restaurant, sort})
    })
    .catch(error => console.log(error))
  } else if (sort === 'location') {
    return Restaurant.find()
    .lean()
    .sort({location: 'asc'})
    .then((restaurant) => {
      res.render('index', {restaurant, sort})
    })
    .catch(error => console.log(error))
  }
})

// 匯出路由器
module.exports = router