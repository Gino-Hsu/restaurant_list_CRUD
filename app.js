// require packages used in the project
const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Restaurant = require('./models/restaurant')

const mongoose = require('mongoose') //載入 mongoose
mongoose.connect(process.env.MONGODB_restaurant_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

// setting template engine
app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')

// setting static files
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

// 取得資料庫連線資料
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

// routes setting
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurant => res.render('index', { restaurant }))
    .catch(error => console.log(error))
})

// create new restaurant
app.get('/restaurants/new', (req,res) => {
  return res.render('new')
})

app.post('/restaurants', (req, res) => {
  const name = req.body.name
  const name_en = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const google_map = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description

  return Restaurant.create({
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description
  })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// // search for name, category, rating
// app.get('/search', (req, res) => {
//   const ratingSelect = req.query.rating
//   const keyword = req.query.keyword.trim()
//   const rating = req.query.rating
//   const restaurants = restaurantList.results.filter(res => {
//     if (res.rating >= Number(ratingSelect)) {
//       return res.name.toLowerCase().includes(keyword.toLocaleLowerCase()) || res.category.includes(keyword)
//     }
//   })
//   // can't find any restaurant by keyword
//   if (restaurants.length === 0 && keyword.length !== 0) {
//     res.render('error', {keyword, rating})
//   } else {
//     res.render('index', {restaurant: restaurants, keyword, rating})
//   }
// })

// // render show page
// app.get('/restaurants/:_id', (req, res) => {
//   const resId = req.params.restaurant_id
//   const restaurant = restaurantList.results.find(res => res.id.toString() === resId)
//   res.render('show', {restaurant})
// })

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})