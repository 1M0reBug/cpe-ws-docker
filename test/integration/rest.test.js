process.env.NODE_ENV = 'production'; // we shut the logger
const expect = require('chai').expect;
const request = require('supertest');

const url = require('../../index');

describe ('REST API', () => {
    describe ('GET /hello', () => {
        it ('should return json hello world!', (done) => {
            request(url)
                .get('/hello')
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res.body).to.have.property('hello', 'world!');
                    done();
                });
        });
    });

    describe ('GET /', () => {
        it ('should return a random word and an ip address', (done) => {
            request(url)
                .get('/')
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res.body).to.have.property('noun');
                    expect(res.body).to.have.property('ip');
                    expect(res.body.noun).to.be.a('string');
                    expect(res.body.ip).to.match(/^(?:\d{1,3}\.){3}\d{1,3}$/);
                    done();
                });
        });
    });

    describe ('POST /', () => {
        it ('should return a random word and an ip address', (done) => {
            request(url)
                .post('/')
                .send({ noun: 'awesome' })
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res.body).to.have.property('noun');
                    expect(res.body).to.have.property('ip');
                    expect(res.body.noun).to.be.a('string');
                    expect(res.body.ip).to.match(/^(?:\d{1,3}\.){3}\d{1,3}$/);
                    done();
                });
        });
    });
})