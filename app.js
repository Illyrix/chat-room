const koa = require("koa")

const logger = require("koa-logger")

const bodyParser = require("koa-bodyparser")

const session = require("koa-session2")

const router = require("./routes/route.js")

const app = new koa()

app.use(logger())

app.use(session({
    key: "KOA_SESS_ID", //default "koa:sess"
}))

app.use(bodyParser())

app.use(router.routes())

app.listen(9000)

const webSocket = require('ws')

const wss = new webSocket.Server({ port: 9001 })

const wsapp = require('./websocket.js')

wss.on('connection', (ws) => {
    wsapp.onMessage(ws, wss)
    wsapp.onClose(ws, wss)
})