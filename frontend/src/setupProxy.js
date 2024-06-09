const proxy = require("http-proxy-middleware");
module.exports = app => {
    app.use(proxy, '/api/signin', {
        target: 'https://plenty-ten.vercel.app',
        changeOrigin: true
    })
}