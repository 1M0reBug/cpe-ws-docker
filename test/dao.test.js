const expect = require('chai').expect;

const Dao = require('../dao');

describe('Dao', () => {

    it('should use a fake mysql instance', () => {
        const fixture = {};
        const dao = new Dao(fixture);
        expect(dao).to.be.an.instanceOf(Dao);
    });

    it('should return a random word', (done) => {
        const fakeConnection = {
            query: (str, cb) => {
                return cb(undefined, [{ word: 'word' }]);
            },
        };

        const dao = new Dao(fakeConnection);
        dao.getRandWord()
            .then(function(word) {
                expect(word).to.be.equal('word');
                done();
            })
            .catch(err => done(new Error(err)));
    });

    it('should insert properly', (done) => {
        const fakeConnection = {
            query: (str, obj, cb) => {
                return cb(undefined);
            },
        };
        const dao = new Dao(fakeConnection);
        dao.push('word')
            .then(() => done())
            .catch((err) => done(new Error(err)));
    });

    it('should catch error when exists', (done) => {
        const fakeConnection = {
            query: (str, obj, cb) => {
                return cb({ message: 'problem' });
            },
        };
        const dao = new Dao(fakeConnection);
        dao.push('word')
            .then(() => done(new Error('error is not present')))
            .catch(err => done() );
    })
})