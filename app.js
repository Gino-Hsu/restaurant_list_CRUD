// require packages used in the project
const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')

// setting template engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

// routes setting
app.get('/', (req, res) => {
  res.render('index', {restaurant: restaurantList.results})
})

// search for name, category, rating
app.get('/search', (req, res) => {
  const ratingSelect = req.query.rating
  const keyword = req.query.keyword.trim()
  const rating = req.query.rating
  const restaurants = restaurantList.results.filter(res => {
    if (res.rating >= Number(ratingSelect)) {
      return res.name.toLowerCase().includes(keyword.toLocaleLowerCase()) || res.category.includes(keyword)
    }
  })
  // can't find any restaurant by keyword
  if (restaurants.length === 0 && keyword.length !== 0) {
    res.render('error', {keyword, rating})
  } else {
    res.render('index', {restaurant: restaurants, keyword, rating})
  }
})

// render show page
app.get('/restaurants/:restaurant_id', (req, res) => {
  const resId = req.params.restaurant_id
  const restaurant = restaurantList.results.find(res => res.id.toString() === resId)
  res.render('show', {restaurant})
})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})