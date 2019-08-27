const client = require('../pg')

module.exports.admin_statistify = (req, res) => {
    let sql = "select * from stores"
    client.query(sql)
    .then(result => {
        res.render('admin_ui', {
            stores: result.rows
        })
    })
    .catch(err => {
        res.redirect('/admin')
    })
    
}
module.exports.admin_see_store = (req, res) => {
    let storeId = req.query.storeId
    res.render('admin_ui', {
        statistify: 'ok',
        storeId
    })
}

module.exports.process_admin_statistify = (req, res) => {
    let {from, to, storeId} = req.body
    let sql = "select sum(price) from orders , products where orders.p_id = products.id "
    sql += "and orders.date > '"+from+"' and orders.date < '"+to+"'"
    sql += " and s_id = " + storeId
    client.query(sql)
    .then(result => {
        res.render('admin_ui', {
            statistify: 'ok',
            resultStatistify: result.rows[0],
            storeId
        })
    })
    .catch(err => {
        res.render('admin_ui', {
            statistify: 'ok',
            storeId
        })
    })
}