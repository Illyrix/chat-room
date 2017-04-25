module.exports = {
    database: 'chatroom',
    username: 'chat',
    password: 'chat-room',
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