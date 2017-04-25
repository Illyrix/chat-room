const Sequelize = require('sequelize')

const Conf = require('../config/config.js')

let sequelize = new Sequelize(
    Conf.database,
    Conf.username,
    Conf.password,
    Conf.options
)

let User = sequelize.define('user', {
    id: {
        field: 'id',
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true
    },
    username: {
        field: 'username',
        type: Sequelize.STRING(64),
        allowNull: false
    },
    password: {
        field: 'password',
        type: Sequelize.STRING(64),
        allowNull: false
    },
    nickname: {
        field: 'nickname',
        type: Sequelize.STRING(64),
        allowNull: false
    }
}, {
    tableName: 'user',
    timestamps: false,
    freezeTableName: true
})

let Room = sequelize.define('room', {
    id: {
        field: 'id',
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        field: 'name',
        type: Sequelize.STRING(64),
        allowNull: false
    },
    creater: {
        field: 'creater',
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'room',
    timestamps: false,
    freezeTableName: true
})

let Ticket = sequelize.define('ticket', {
    id: {
        field: 'id',
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true
    },
    roomid: {
        field: 'roomid',
        type: Sequelize.INTEGER,
        allowNull: false
    },
    userid: {
        field: 'userid',
        type: Sequelize.INTEGER,
        allowNull: false
    },
    token: {
        field: 'token',
        type: Sequelize.STRING(64),
        allowNull: false
    }
}, {
    tableName: 'ticket',
    timestamps: false,
    freezeTableName: true
})

let Log = sequelize.define('log', {
    id: {
        field: 'id',
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true
    },
    roomid: {
        field: 'roomid',
        type: Sequelize.INTEGER,
        allowNull: false
    },
    userid: {
        field: 'userid',
        type: Sequelize.INTEGER,
        allowNull: false
    },
    message: {
        field: 'message',
        type: Sequelize.STRING(65535),
        allowNull: false
    },
    time: {
        field: 'time',
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
    tableName: 'log',
    timestamps: false,
    freezeTableName: true
})

let Access = sequelize.define('access', {
    id: {
        field: 'id',
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true
    },
    roomid: {
        field: 'roomid',
        type: Sequelize.INTEGER,
        allowNull: false
    },
    userid: {
        field: 'userid',
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'access',
    timestamps: false,
    freezeTableName: true
})

module.exports = { User, Room, Ticket, Log, Access }