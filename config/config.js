module.exports = {
    database: 'chatroom',
    username: 'root',
    password: '',
    options: {
        host: 'localhost',
        port: 3306,
        dialect: 'mysql',
        pool: {
            max: 20,
            min: 0,
            idle: 10000
        },
    }
}