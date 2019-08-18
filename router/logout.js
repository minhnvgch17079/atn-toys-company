var express = require('express')
var router = express.Router()

var sess
router.get('/', function(req, res) {
    sess = req.session
    if(sess.username || sess.store || sess.admin) {
        req.session.destroy(function(err) {
            if(err) {
                console.log(err)
            } else {
                res.redirect('/')
            }
        })
    } else {
        res.redirect('/')
    }
})
module.exports = router