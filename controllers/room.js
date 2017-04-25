const session = require('../library/session.js')
const model = require('../library/model.js')

async function get(ctx, next) {
    let user = await session.loginUser(ctx)
    if (!user) {
        ctx.throw(403)
        return false
    }
    let q = await model.Access.findAll({ where: { userid: user['id'], order: 'id DESC' } })
    let rooms = []
    for (let i in q)
        rooms.push(q[i]['roomid'])
    let r = await model.Room.findAll({
        attributes: ['name'],
        where: { id: { $in: rooms } }
    })
    rooms = []
    for (let i in r)
        rooms.push({ id: r[i]['id'], name: r[i]['name'] })
    ctx.response.body = rooms
}

async function create(ctx, next) {
    let user = await session.loginUser(ctx)
    if (!user) {
        ctx.throw(403)
        return false
    }
    let data = ctx.request.body
    if (!data || !data['name']) {
        ctx.throw(400)
        return false
    }
    if (await model.Room.find({ where: { name: data['name'] } })) {
        ctx.throw(400)
        return false
    }
    await model.Room.create({
        name: data['name'],
        creater: user.id
    })
    ctx.response.status = 201
    return true
}

async function del(ctx, next) {
    let user = await session.loginUser(ctx)
    if (!user) {
        ctx.throw(403)
        return false
    }
    let id = ctx.params.id
    if (!await model.Room.find({ where: { id, creater: user.id } })) {
        ctx.throw(403)
        return false
    }
    await model.Room.destroy({ where: { id, creater: user.id } })
    ctx.response.status = 204
    return true
}

async function getToken(ctx, next) {
    let user = await session.loginUser(ctx)
    if (!user) {
        ctx.throw(403)
        return false
    }
    let id = ctx.params.id
    if (!await model.Access.find({ where: { roomid: id, userid: user.id } })) {
        ctx.throw(403)
        return false
    }
    let query = await model.Ticket.find({ where: { roomid: id, userid: user.id } })
    if (!query) {
        token = crypto.createHash('md5').update(Math.random()).digest('hex')
        await model.Ticket.create({
            roomid: id,
            userid: user.id,
            token
        })
        ctx.response.body = { token }
        return true
    } else ctx.response.body = { token: query['token'] }
    return true
}

module.exports = {get, create, del, getToken }

// async function removeUser(ctx, next) {
//     let user = await session.loginUser(ctx)
//     if (!user) {
//         ctx.throw(403)
//         return false
//     }
//     let id = ctx.params.id
//     let username = ctx.params.username
//     let us
//     if (!await model.Room.find({ where: { id, creater: user.id } })) {
//         ctx.throw(403)
//         return false
//     }
//     await model.Access.destroy({ where: { roomid:id, userid:  } })
//     ctx.response.status = 204
//     return true
// }