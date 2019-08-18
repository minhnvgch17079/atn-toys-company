let sess
const multer = require('multer')
let client = require('../pg')
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/img')
    },
    filename: (req, file, cb) => {
        sess = req.session
        cb(null, sess.store + file.originalname)
    }
})
let fileFilter = (req, file, cb) => {
    if (
        file.mimetype == 'image/jpeg' ||
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/png'
    ) {
        cb(null, true)
    } else {
        cb('Wrong format of image, only image accepted')
    }
}
let limits = {fileSize: 1024 * 1024}
let uploads = multer({limits: limits, fileFilter: fileFilter, storage: storage}).single('file')
module.exports.checkStore = (req, res, next) => {
    sess = req.session
    if(sess.storeid) {
        next()
    } else {
        res.redirect('/')
    }
}

module.exports.showFormAddProduct = (req, res) => {
    res.render('addProduct')
}

module.exports.processAddProduct = (req, res) => {
    uploads(req, res, err => {
        let name = req.body.name
        let price = req.body.price
        let info = req.body.info
        var errors = []
        if (name == '') {
            errors.push('Please Input Product Name')
        }
        if (isNaN(price) || price =='') {
            errors.push('Price must be number')
        }
        if (info == '') {
            errors.push('Please input information')
        }
        if(errors.length > 0) {
            res.render('addProduct', {
                error: errors
            })
            return
        }
        if(err) {
            if(err.message == undefined) {
                res.render('addProduct', {
                    result: err
                })
            } else {
                res.render('addProduct', {
                    result: err.message
                })
            }
            return
        }
        if(req.file) {
            let img = '/img/' + sess.store + req.file.originalname
            let sql = "insert into product(name, price, info, store_id, img) values "
            sql += "('"+name+"', '"+price+"', '"+info+"', '"+sess.storeid+"', '"+img+"')" 
            client.query(sql, (err, result) => {
                if (err) {
                    console.log('err in line 78 controller.store.add.js')
                } else {
                    res.render('addProduct', {
                        result: 'Adding Successfully! Please Waiting For Admin Confirm'
                    })
                }
            })           
        } else {
            res.render('addProduct', {
                result: 'Need Image For Product'
            })
        }
    })
    
}