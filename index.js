const express = require('express')
const app = express()
app.listen(process.env.PORT || 3000)

let {check, validationResult} = require('express-validator')

let expressSession = require('express-session')
app.use(expressSession({
    secret: '!$44f!!%^^!FFFFAQFACK'
}))

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

let register = require('./router/register')
app.use('/register', register)

let login = require('./router/login')
app.use('/login', login)

let logout = require('./router/logout')
app.use('/logout', logout)

let storeLogin = require('./router/store-login')
app.use('/store', storeLogin)

let card = require('./router/card')
app.use('/card', card)

let myorder = require('./router/myorder')
app.use('/myorder', myorder)

let admin = require('./router/admin')
app.use('/admin', admin)

let index = require('./controllers/controller.index')

app.get('/', index.showProductAsPage) //SHOW PRODUCT PAGE 1,2,3,... DEPEND ON USER CHOSSEN

app.post('/', [
    check('search').escape()
], index.searchProduct)

app.get('/:id', [
    check('storeid').isLength({max: 3}).escape()
], index.seeStore) //SEE ALL PRODUCT OF 1 STORE THAT CUSTOMER CHOICE
