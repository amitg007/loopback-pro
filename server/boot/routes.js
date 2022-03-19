module.exports = function (app) {
    var router = app.loopback.Router()
    router.get('/custom-routes', function (req, res) {
        res.send('Custom Routes Created Successfully')
    })
    app.use(router)
}