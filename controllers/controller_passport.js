const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const client = require('../pg')
const extractorJwt = (req) => {
    let token = null
    if (req && req.cookies.token) {
        token = req.cookies.token
    }
    return token
}

let customer = {}
customer.jwtFromRequest = extractorJwt
customer.secretOrKey = 'customertramdien'

let store = {}
store.jwtFromRequest = extractorJwt
store.secretOrKey = 'storetramdien'

let admin = {}
admin.jwtFromRequest = extractorJwt
admin.secretOrKey = 'admintramdien'

passport.serializeUser((user, done) => {
    return done(null, user)
})

passport.deserializeUser((user, done) => {
    return done(null, user)
})

passport.use('customer', new JwtStrategy(customer, (jwt_payload, done) => {
    let sql = "select * from customers where id = " + jwt_payload.id
    client.query(sql)
    .then(result => {
        if (result.rows.length == 0) {
            return done(null, false)
        } else {
            return done(null, result.rows[0])
        }
    })
    .catch(error => {
        return done(error, false)
    })
}))

passport.use('store', new JwtStrategy(store, (jwt_payload, done) => {
    let sql = "select * from stores where id = " + jwt_payload.id
    client.query(sql)
    .then(result => {
        if (result.rows.length == 0) {
            return done(null, false)
        } else {
            return done(null, result.rows[0])
        }
    })
    .catch(error => {
        return done(error, false)
    })
}))

passport.use('admin', new JwtStrategy(admin, (jwt_payload, done) => {
    let sql = "select * from admins where id = " + jwt_payload.id
    client.query(sql)
    .then(result => {
        if (result.rows.length == 0) {
            return done(null, false)
        } else {
            return done(null, result.rows[0])
        }
    })
    .catch(error => {
        return done(error, false)
    })
}))