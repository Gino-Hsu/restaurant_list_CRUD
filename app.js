// require packages used in the project
const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Restaurant = require('./models/restaurant')

const mongoose = require('mongoose') //載入 mongoose
const restaurant = require('./models/restaurant')
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
  const {name, name_en, category, image, location, phone, google_map, rating, description} = req.body

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

// search for name, category, rating
app.get('/search', (req, res) => {
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
app.get('/sort', (req, res) => {
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
// render show page
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => {res.render('show', {restaurant})})
    .catch(error => console.log(error))
})

// edit restaurant
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => {res.render('edit', {restaurant})})
    .catch(error => console.log(error))
})

app.post('/restaurants/:id/edit', (req, res) => {
  const {name, name_en, category, image, location, phone, google_map, rating, description} = req.body
  const id = req.params.id

  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = name
      restaurant.name_en = name_en
      restaurant.category = category
      restaurant.image = image
      restaurant.location = location
      restaurant.phone = phone
      restaurant.google_map = google_map
      restaurant.rating = rating
      restaurant.description = description

      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

// delete restaurant
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})