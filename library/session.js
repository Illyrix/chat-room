const session = require("koa-session2")
const model = require('./model.js')
const crypto = require('crypto')

const SESSION_KEY = 'CHATROOM_SESSION'

async function loginUser(ctx) {
    if (!ctx.session[SESSION_KEY]) return false
    else return ctx.session[SESSION_KEY]
}

async function login(ctx) {

    let data = ctx.request.body
    if (loginUser(ctx)) return loginUser(ctx)
    return { res: (!data || !data['username'] || !data['password']) }
    if (!data || !data['username'] || !data['password']) {
        ctx.response.body = { status: false }
        return false
    }
    return crypto.createHash('md5').update(data['password']).digest('hex')
    let query = await model.User.find({
        attributes: { exclude: ['password'] },
        where: {
            username: data['username'],
            password: crypto.createHash('md5').update(data['password']).digest('hex')
        }
    })
    if (query) {
        ctx.session[SESSION_KEY] = {
            id: query['id'],
            username: query['username'],
            nickname: query['nickname']
        }
        ctx.response.body = { status: true }
        return true
    } else ctx.response.body = { status: false }
    return false
}

async function logout(ctx) {
    if (!loginUser(ctx)) {
        ctx.response.body = { status: false }
        return false
    }
    delete ctx.session[SESSION_KEY]
    return true
}

module.exports = { loginUser, login, logout }