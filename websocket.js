const model = require('./library/model.js')

const SESSION = 'SESSION'

const getNowTime = () => parseInt(new Date().getTime() / 1000)

const broadcast = (wss, roomid, userid, data) => {
    wss.clients.forEach((each) => {
        if (each[SESSION] && each[SESSION]['roomid'] == roomid && each[SESSION]['userid'] != userid) {
            each.send(JSON.stringify(data))
        }
    })
}

function onMessage(ws, wss) {
    ws.on('message', (msg) => {
        if (ws[SESSION] == undefined) {
            let token = ''
            try {
                let data = JSON.parse(msg)
                token = data['token']
                if (!token) {
                    ws.close()
                    return
                }
            } catch (e) {
                ws.close()
                return
            }
            model.Ticket.find({ where: { token } }).then(
                (data) => {
                    model.User.find({ where: { id: data['userid'] } }).then((user) => {
                        ws[SESSION] = {
                            id: data['id'],
                            userid: data['userid'],
                            roomid: data['roomid'],
                            username: user['username'],
                            nickname: user['nickname']
                        }
                        broadcast(wss, data['roomid'], data['userid'], {
                            type: 1,
                            username: user['username'],
                            nickname: user['nickname'],
                            action: 1,
                            time: getNowTime()
                        })
                    })
                }, (err) => {
                    ws.close()
                    return
                }
            )
        } else {
            let msg = ''
            try {
                let data = JSON.parse(msg)
                msg = data['msg']
                if (!msg) {
                    ws.send(JSON.stringify({ status: false }))
                    return
                }
            } catch (e) {
                ws.send(JSON.stringify({ status: false }))
                return
            }
            model.Log.create({
                roomid: ws[SESSION]['roomid'],
                userid: ws[SESSION]['userid'],
                message: msg
            }).then(
                () => {
                    ws.send(JSON.stringify({ status: true }))
                    broadcast(wss, ws[SESSION]['roomid'], ws[SESSION]['userid'], {
                        type: 0,
                        msg,
                        username: ws[SESSION]['username'],
                        nickname: ws[SESSION]['nickname'],
                        time: getNowTime()
                    })
                },
                () => ws.send(JSON.stringify({ status: false }))
            )
        }
    })
}

function onClose(ws, wss) {
    ws.on('close', (close) => {
        if (ws[SESSION]) {
            broadcast(wss, ws[SESSION]['roomid'], ws[SESSION]['userid'], {
                type: 1,
                username: ws[SESSION]['username'],
                nickname: ws[SESSION]['nickname'],
                action: 0,
                time: getNowTime()
            })
        }
    })
}

module.exports = { onMessage, onClose }