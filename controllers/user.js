const session = require('../library/session.js')
const model = require('../library/model.js')
const crypto = require('crypto')

async function create(ctx, next) {
    let data = ctx.request.body
    if (!data || !data['username'] || !data['password'] || !data['nickname']) {
        ctx.throw(400)
        return false
    }
    if (await model.User.find({ where: { username: data['username'] } })) {
        ctx.throw(400)
        return false
    }
    await model.User.create({
        username: data['username'],
        password: crypto.createHash('md5').update(data['password']).digest('hex'),
        nickname: data['nickname']
    })
    ctx.response.status = 201
    return true
}

async function get(ctx, next) {
    let username = ctx.params.username
    let query = await model.User.find({ where: { username } })
    if (!query) {
        ctx.throw(404)
        return false
    } else {
        let data = query.get()
        delete data['password']
        ctx.response.body = data
        return true
    }
}

async function login(ctx, next) {
    ctx.response.body = await session.login(ctx)
        // if (!await session.login(ctx))
        //     ctx.response.status = 403
        // else
        //     ctx.response.status = 200
}

async function logout(ctx, next) {
    return await session.logout(ctx)
}

module.exports = { create, get, login, logout }