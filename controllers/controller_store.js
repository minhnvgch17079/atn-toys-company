const fs = require('fs')
const client = require('../pg')
const multer = require('multer')
let {check, validationResult} = require('express-validator')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/img')
    },
    filename: (req, file, cb) => {
        cb(null, req.user.s_name + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype == 'image/jpeg' ||
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/png'
    ) {
        cb(null, true)
    } else {
        cb('Wrong format of image')
    }
}
const limits = {fileSize: 1024 * 1024}
let uploads = multer({limits: limits, fileFilter: fileFilter, storage: storage}).single('file')

module.exports.list_all_product = (req, res) => {
    let sql = "select * from products where s_id = " + req.user.id
    client.query(sql)
    .then(result => {
        res.render('store_ui', {
            products: result.rows
        })
    })
    .catch(error => {
        res.redirect('/store')
    })
}
module.exports.edit_product = (req, res) => {
    let productId = req.query.productId
    if(isNaN(productId)) {
        res.redirect('/store')
        return
    } 
    let sql = "select * from products where id = " + productId
    sql += " and s_id = " + req.user.id 
    client.query(sql)
    .then(result => {
        res.render('store_ui', {
            edit: result.rows[0]
        })
    })
    .catch(error => {
        res.redirect('/store')
    })
}
module.exports.process_edit_product = (req, res) => {
    uploads(req, res, err => {
        let {productId, productname} = req.body
        let price = parseInt(req.body.price)
        let sql = "select * from products where id = " + productId
        sql += " and s_id = " + req.user.id
        client.query(sql)
        .then(result => {
            if (result.rows.length == 0) {
                res.redirect('/store')
            } else {
                if(productname == '') {
                    productname = result.rows[0].p_name
                }
                if(price == '' || isNaN(price)) {
                    price = result.rows[0].price
                }
                if (req.file) {
                    fs.unlink('./public' + result.rows[0].img, err => {
                        if(err) {console.log(err + '')}
                    })
                    let img = req.user.s_name + req.file.originalname
                    sql = "update products set p_name = '"+productname+"',"
                    sql += "price = "+price+","
                    sql += "img = '/img/"+img+"' where s_id = " + req.user.id + " and id = " + result.rows[0].id
                    client.query(sql)
                    .then(r => {res.redirect('/store')})
                    .catch(e => {res.redirect('/store')})
                } else {
                    sql = "update products set p_name = '"+productname+"',"
                    sql += "price = "+price+""
                    sql += " where s_id = " + req.user.id + " and id = " + result.rows[0].id
                    client.query(sql)
                    .then(r => {res.redirect('/store')})
                    .catch(e => {res.redirect('/store')})
                }
            }
        })
        .catch(err => {
            res.redirect('/store')
        })
    })
}
module.exports.add_product = (req, res) => {
    res.render('store_ui', {
        add: 'ok'
    })
}
module.exports.process_add_product = (req, res) => {
    uploads(req, res, err => {
        if(err) {
            res.render('store_ui', {
                add: 'ok',
                addErr: 'Wrong format of image or file too large. Only image accepted and size limit by 1MB'
            })
            return
        }
        let {productname} = req.body
        let price = parseInt(req.body.price)
        if(isNaN(price) || price > 999) {
            res.render('store_ui', {
                add: 'ok',
                addErr: 'Wrong format of price or price must smaller than 999'
            })
            return
        }
        if(productname == '') {
            res.render('store_ui', {
                add: 'ok',
                addErr: 'Please input name for product'
            })
            return
        }
        if(req.file) {
            let img = '/img/' + req.user.s_name + req.file.originalname
            let sql = "insert into products(p_name, price, img, s_id) values "
            sql += "('"+productname+"', "+price+", '"+img+"', "+req.user.id+")"
            client.query(sql)
            .then(result => {
                res.redirect('/store')
            })
            .catch(error => {
                res.redirect('/store')
            })
        } else {
            res.redirect('/store')
        }
    })
    
    
}
module.exports.process_delete_product = (req, res) => {
    let productId = req.query.productId
    let sql = "delete from orders where p_id = "+productId+";delete from products where id = " + productId
    sql += " and s_id =" + req.user.id
    console.log(sql)
    client.query(sql)
    .then(result => {
        res.redirect('/store')
    })
    .catch(err => {
        res.redirect('/store')
    })
}
module.exports.store_statistify = (req, res) => {
    res.render('store_ui', {
        statistify: 'ok'
    })
}
module.exports.store_process_statistify = (req, res) => {
    let {from, to} = req.body
    let sql = "select sum(price) from orders , products where orders.p_id = products.id "
    sql += "and orders.date > '"+from+"' and orders.date < '"+to+"'"
    sql += " and s_id = " + req.user.id
    client.query(sql)
    .then(result => {
        res.render('store_ui', {
            statistify: 'ok',
            resultStatistify: result.rows[0]
        })
    })
    .catch(err => {
        res.render('store_ui', {
            statistify: 'ok'
        })
    })
}