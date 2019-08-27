const {Client, Pool} = require('pg')
const client = new Client({
    database: 'xuyen',
    host: 'localhost',
    user: 'postgres',
    password: '2108',
    port: 5433
})

client.connect()

module.exports = client