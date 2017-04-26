const router = require("koa-router")()
const controllers = require("../controllers/controller.js")

router
    .post('/User', async(ctx, next) => {
        await (controllers['user']['create'](ctx, next))
    })
    .get('/User/:username', async(ctx, next) => {
        await (controllers['user']['get'](ctx, next))
    })
    .post('/Login', async(ctx, next) => {
        await (controllers['user']['login'](ctx, next))
    })
    .post('/Logout', async(ctx, next) => {
        await (controllers['user']['logout'](ctx, next))
    })
    .get('/Room', async(ctx, next) => {
        await (controllers['room']['get'](ctx, next))
    })
    .post('/Room', async(ctx, next) => {
        await (controllers['room']['create'](ctx, next))
    })
    .put('/Room/:id', async(ctx, next) => {
        await (controllers['room']['addUser'](ctx, next))
    })
    .delete('/Room/:id', async(ctx, next) => {
        await (controllers['room']['del'](ctx, next))
    })
    .get('/Room/:id', async(ctx, next) => {
        await (controllers['room']['getToken'](ctx, next))
    })
    // .delete('/Room/:id/:username', async(ctx, next) => {
    //     await (controllers['room']['removeUser'](ctx, next))
    // })

module.exports = router;