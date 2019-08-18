let sess
let client = require('../pg')
let {check, validationResult} = require('express-validator')

module.exports.showProductAsPage = (req, res) => {
    let page = req.query.page - 1 // 0 mean OFFSET 0 ROWS FIRST, 1->16, 2->32
    sess = req.session
    let sql = "SELECT * FROM product WHERE is_show = TRUE ORDER BY id"
    sql += " OFFSET " + page * 16 + " ROWS" //NUMBER OF ROWS THAT OFFSET
    sql += " FETCH FIRST 16 ROWS ONLY" //NUMBER OF PRODUCT WANT IN A PAGE
    client.query(sql, (err, result) => {
        if(err) {
            res.redirect('/?page=1')
        } else {
            if(sess.username) {
                res.render('index', {
                    username: sess.username,
                    product: result.rows,
                    notstore: 'ok'
                })
            } else {
                res.render('index', {
                    product: result.rows,
                    notstore: 'ok'
                })
                
            }
        }
    })
}

module.exports.searchProduct = (req, res) => {
    sess = req.session
    let search = req.body.search
    let sql = "SELECT * FROM product WHERE is_show = TRUE AND LOWER(name) LIKE '%"+search.toLowerCase()+"%'"
    client.query(sql, (err, result) => {
        if(err) {
            res.redirect('/?page=1')
        } else {
            if(sess.username) {
                res.render('index', {
                    username: sess.username,
                    product: result.rows,
                    notstore: 'ok'
                })
            } else {
                res.render('index', {
                    product: result.rows,
                    notstore: 'ok'
                }) 
            }
        }
    })
}

module.exports.seeStore = (req, res) => {
    sess = req.session
    let storeid = req.params.id
    let page = req.query.page - 1
    let errors = validationResult(req)
    if(errors.isEmpty()) {
        let sql = "SELECT * FROM product WHERE is_show = TRUE AND store_id = " + storeid
        sql += " OFFSET " + (page * 16) + " ROWS"
        sql += " FETCH FIRST 16 ROW ONLY"
        client.query(sql, (err, result) => {
            if (err) {
                if(isNaN(storeid)) {
                    res.redirect('/')
                } else res.redirect('/' + storeid +'?page=1')
            } else {
                sql = "SELECT * FROM store WHERE id = " + storeid
                client.query(sql, (err, result1) => {
                    if(err) {
                        console.log('err in line 116 at index.js')
                    } else {
                        if(sess.username) {
                            res.render('index', {
                                username: sess.username,
                                product: result.rows,
                                store: result1.rows[0]
                            })
                        } else {
                            res.render('index', {
                                product: result.rows,
                                store: result1.rows[0]
                            }) 
                        }
                    }
                })
            }
        })
    } else {
        res.redirect('/')
    }
}