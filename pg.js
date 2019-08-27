const {Client, Pool} = require('pg')
const client = new Client({
    database: 'd9fqqdces1p51b',
    host: 'ec2-54-225-72-238.compute-1.amazonaws.com',
    user: 'gbrmmmxlvzbwlb',
    password: '8c344f13f7166457b94caefbb9340bf599ba7f3dcb26bc95bd91dcdbf7349316',
    port: 5432,
    ssl: true
})

client.connect()

module.exports = client