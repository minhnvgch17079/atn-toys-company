require('./controllers/controller_passport')
const express = require('express')
const app = express()
const passport = require('passport')
const expressSession = require('express-session')
const cookieParser = require('cookie-parser')
const client = require('./pg')
const register = require('./controllers/controller_register')
const login = require('./controllers/controller_login')
const store = require('./controllers/controller_store')
const customer = require('./controllers/controller_customer')
const admin = require('./controllers/controller_admin')

app.use(express.static('public'))
app.use(expressSession({secret: 'Tram Dien'}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())


app.set('view engine', 'ejs')
app.set('views', 'views')

app.get('/', (req, res) => {
    let page = parseInt(req.query.page) - 1
    if(isNaN(page)) {
        page = 0
    }
    let sql = "select * from products offset " + (page * 4) + " rows fetch first 4 rows only"
    console.log(sql)
    client.query(sql)
    .then(result => {
        res.render('index', {
            products: result.rows
        })
    })
    
})

app.get('/register', register.register)
app.post('/register',register.prosess_register)

app.get('/customers/login', login.customer_login)
app.post('/customers/login', login.process_customer_login)

app.get('/stores/login', login.store_login)
app.post('/stores/login', login.process_store_login)

app.get('/admins/login', login.admin_login)
app.post('/admins/login', login.process_admin_login)

app.get('/customer', passport.authenticate('customer', {failureRedirect: '/'}), customer.list_all_products)
app.get('/customer/order', passport.authenticate('customer', {failureRedirect: '/'}), customer.customer_order)
app.post('/customer/order', passport.authenticate('customer', {failureRedirect: '/'}), customer.process_customer_order)

app.get('/store', passport.authenticate('store', {failureRedirect: '/'}), store.list_all_product)
app.get('/store/products/edit', passport.authenticate('store', {failureRedirect: '/'}), store.edit_product)
app.post('/store/products/edit', passport.authenticate('store', {failureRedirect: '/'}), store.process_edit_product)
app.get('/store/products/add', passport.authenticate('store', {failureRedirect: '/'}), store.add_product)
app.post('/store/products/add', passport.authenticate('store', {failureRedirect: '/'}), store.process_add_product)
app.get('/store/products/delete', passport.authenticate('store', {failureRedirect: '/'}), store.process_delete_product)
app.get('/store/statisify', passport.authenticate('store', {failureRedirect: '/'}), store.store_statistify)
app.post('/store/statisify', passport.authenticate('store', {failureRedirect: '/'}), store.store_process_statistify)

app.get('/admin/storestatisify', passport.authenticate('admin', {failureRedirect: '/'}), admin.admin_statistify)
app.get('/admin/store/storestatisify', passport.authenticate('admin', {failureRedirect: '/'}), admin.admin_see_store)
app.post('/admin/statisify', passport.authenticate('admin', {failureRedirect: '/'}), admin.process_admin_statistify)





app.get('/admin', passport.authenticate('admin', {failureRedirect: '/'}), (req, res) => {
    res.render('admin_ui')
})

app.listen(3000 || process.env.PORT, () => {
    console.log('App running')
})