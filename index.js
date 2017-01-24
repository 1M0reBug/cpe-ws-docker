const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const ip = require('ip');
const Dao = require('./dao');
const dao = new Dao();

app.set('env', process.env.NODE_ENV || 'development');
if (process.env.NODE_ENV !== 'production') app.use(logger('dev'));
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
    dao.getRandWord()
        .then(word => 
            res.json({ adjective: word, ip: ip.address() })
        )
        .catch(err => {
            err.status = 500;
            next(err);
        }); 
});

app.post('/', (req, res, next) => {
    const adjective = req.body.adjective;
    dao.push(adjective)
        .then(() => dao.exists(adjective))
        .then(() => res.json({ adjective: adjective, ip: ip.address() }))
        .catch(() => {
            const err = new Error(`${adjective} could not be added properly`);
            err.status = 500;
            next(err);
        });
});

app.get('/hello', (req, res) => {
    res.json({ hello: 'world!' });
});

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err,
        });
    });
}

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {},
    });
});

app.listen(3000, () => {
    if (process.env.NODE_ENV !== 'production') console.log('Listening on 0.0.0.0:3000');
});

module.exports = app;