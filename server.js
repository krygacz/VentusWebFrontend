const express = require('express');
const history = require('connect-history-api-fallback');
const app = express();
const serveStatic = require('serve-static');
const cors = require('cors');
app.use(cors());
app.use(serveStatic(__dirname + "/dist"));
app.use(history({
    disableDotRule: true,
    verbose: true
}));
app.use(serveStatic(__dirname + "/dist"));
var port = process.env.PORT || 8080;
app.listen(port);