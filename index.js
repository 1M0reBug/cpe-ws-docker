const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const ip = require('ip');
const Dao = require('./dao');
const dao = new Dao();

app.set('env', process.env.NODE_ENV || 'development');
if (process.env.NODE_ENV !== 'test') app.use(logger('dev'));
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
    dao.getRandWord()
        .then(word => 
            res.json({ verb: word, ip: ip.address() })
        )
        .catch(err => {
            err.status = 500;
            next(err);
        }); 
});

app.post('/', (req, res, next) => {
    const verb = req.body.verb;
    dao.push(verb)
        .then(() => dao.exists(verb))
        .then(() => res.json({ verb: verb, ip: ip.address() }))
        .catch(() => {
            const err = new Error(`${verb} could not be added properly`);
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
    if (process.env.NODE_ENV !== 'test') console.log('Listening on 0.0.0.0:3000');
});

module.exports = app;