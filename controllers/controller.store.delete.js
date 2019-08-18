let sess
const client = require('../pg')
let fs = require('fs')

module.exports.checkStore = (req, res, next) => {
    sess = req.session
    if(sess.storeid) {
        next()
    } else {
        res.redirect('/')
    }
}

module.exports.processDelete = (req, res) => {
    sess = req.session
    let errors = []
    let idsanpham = req.params.id
    if(isNaN(idsanpham)) {
        errors.push('Invalid Product')
        res.writeHead(200, {
            "Content-type" : "text/html"
        })
        res.end('<h1>Invalid Product<h1><a href="/store/product">Back</a>')
        return
    }
    if(errors.length == 0) {
        let sql = " FROM product WHERE id = " + idsanpham + " AND store_id = " + sess.storeid
        client.query("SELECT *" + sql, (err, result) => {
            if(err || result.rows.length == 0) {
                res.writeHead(404, {
                    "Content-type" : "text/html"
                })
                res.end('<h1>Cannot delete<h1><a href="/store/product">Back</a>')
            } else {
                fs.unlink('./public' + result.rows[0].img, err => {
                    if(err) {
                        console.log(err)
                    }
                })
                client.query("DELETE" + sql, (err, result) => {
                    if (err) {
                        console.log(err)
                    } else {
                        res.writeHead(200, {
                            "Content-type" : "text/html"
                        })
                        res.end('<h1>Delete Success</h1><a href="/store/product">Back</a>')
                    }
                })
            }
        })
    }
}