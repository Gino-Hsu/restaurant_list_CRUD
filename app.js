// require packages used in the project
const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const Restaurant = require('./models/restaurant')
const routes = require('./routes') // 引用路由器

const mongoose = require('mongoose') //載入 mongoose
const restaurant = require('./models/restaurant')
mongoose.connect(process.env.MONGODB_restaurant_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

// setting template engine
app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')

// setting static files
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes) // 將 request 導入路由器

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

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})