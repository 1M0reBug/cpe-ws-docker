const expect = require('chai').expect;
const VERBS = require('../verbs');

const Store = require('../dao').Store;

describe ('Store', () => {
    let store;
    beforeEach (() => {
        store = new Store();
    })
    it ('should create a new Store', () => {
        expect(store).to.be.an.instanceOf(Store);
    });

    it ('should contain an initial list of words', () => {
        expect(store.store.data).to.be.eql(VERBS);
    });

    it ('inner store should be a store type', () => {
        expect(store.store).to.have.property('data');
        expect(store.store).to.have.property('createdAt');
        expect(store.store).to.have.property('changedAt');
    });

    describe ('#get(idx)', () => {
        it ('should return a specific store element', () => {
            expect(store.get(0)).to.be.a('string');
        });
    });

    describe ('#push(word)', () => {
        it ('should add a new word to the store', () => {
            const wordTest = 'thisIsAWordTest';
            store.push(wordTest)
            expect(store.store.data.lastIndexOf(wordTest)).to.not.be.equal(-1);
        });

        it ('should change the current store', () => {
            const oldStore = store.store;
            store.push('test');
            expect(store.store).to.not.be.eql(oldStore);
        });
        
        function getNextToLastStore() {
            return store._store[store._store.length - 2];
        }

        it ('should archive the old store', () => {
            const oldStore = store.store;
            store.push('test');
            // FIXME accessing private data here
            expect(getNextToLastStore()).to.be.eql(oldStore);
        });

        it ('should update old store `changedAt` property', () => {
            const oldChangedAt = store.store.changedAt;
            store.push('test');
            expect(getNextToLastStore().changedAt).to.not.be.equal(oldChangedAt);
        });
    });

    describe ('#exists(word)', () => {
        it ('should return true if word is added', () => {
            store.push('test');
            expect(store.exists('test')).to.be.true;
        });

        it ('should return false if word does not exists', () => {
            expect(store.exists('test')).to.be.false;
        });
    });

    describe ('#size()', () => {
        it ('should return the number of elements', () => {
            const expected = VERBS.length;
            expect(store.size()).to.be.equal(expected);
        });

        it ('should increment when pushed new word', () => {
            const oldSize = store.size();
            store.push('newWord');
            expect(store.size()).to.be.equal(oldSize + 1);
        });
    });
});