const expect = require('chai').expect;
const sinon = require('sinon');

const Store = require('../dao').Store;
const Dao = require('../dao');
const NOUNS = require('../nouns');

describe('Dao', () => {
    it ('should create an instance of Dao', () => {
        const dao = new Dao();
        expect(dao).to.be.an.instanceOf(Dao);
    });

    describe ('#getRandWord', () => {
        it ('should return something from the Store', (done) => {
            const fixture = new Store();
            sinon.stub(fixture, 'get').returns('toto');
            sinon.stub(fixture, 'size').returns(1);

            const testDao = new Dao(fixture); 
            testDao.getRandWord()
                .then((word) => {
                    expect(word).to.be.equal('toto');
                    done();
                })
                .catch((err) => {
                    done(new Error(err));
                });
        });

        it ('should return something from the NOUNS list and use Store', (done) => {
            const fixture = new Store();
            const getSpy = sinon.spy(fixture, 'get');
            const sizeSpy = sinon.spy(fixture, 'size');

            const testDao = new Dao(fixture);
            testDao.getRandWord()
                .then(word => {
                    expect(word).to.be.oneOf(NOUNS);
                    expect(getSpy.called).to.be.true;
                    expect(sizeSpy.called).to.be.true;
                    done();
                })
                .catch(err => {
                    done(new Error(err));
                });
        });
    });

    describe ('#push', () => {
        it('should add an element', (done) => {
        const fixture = new Store();
        const testDao = new Dao(fixture);
        const oldSize = fixture.size();
        testDao.push('lorem')
            .then(() => {
                expect(fixture.size()).to.be.equal(oldSize + 1);
                done();
            })
            .catch(err => {
                done(new Error(err));
            })
        });
    });

    describe ('#exists', () => {
        it ('should return true if element exists in store', (done) => {
            const fixture = new Store();
            sinon.stub(fixture, 'exists').returns(true);

            const testDao = new Dao(fixture);
            testDao.exists('lorem')
                .then(() => {
                    done();
                })
                .catch((err) => {
                    done(new Error(err));
                })
        });

        it ('should return false if element does not exist in store', (done) => {
            const fixture = new Store();
            sinon.stub(fixture, 'exists').returns(false);

            const testDao = new Dao(fixture);
            testDao.exists('lorem')
                .then(err => done(new Error(err)))
                .catch(err => done());
        })
    })


});