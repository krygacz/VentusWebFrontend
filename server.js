const express = require('express');
const history = require('connect-history-api-fallback');
const app = express();
const serveStatic = require('serve-static');
const cors = require('cors');
const port = process.env.PORT || 8080;

var forceSsl = function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    return next();
};
app.use(forceSsl);
app.use(cors());
app.use(serveStatic(__dirname + "/dist"));
app.use(history({
    disableDotRule: true,
    verbose: true
}));
app.use(serveStatic(__dirname + "/dist"));
app.listen(port);