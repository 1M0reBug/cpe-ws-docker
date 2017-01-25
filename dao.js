const VERBS = require('./verbs');

/**
 * inner class used in getRandWord
 * it is used only as immutable store of data,
 * and as a replacement for a real DB.
 * 
 * @class Store
 */
function Store() {
    const creationDate = new Date();
    this._store = [{
        data: VERBS,
        createdAt: creationDate,
        changedAt: creationDate,
    }];
    this.store = this._store[0];
}
/**
 * Create a new store, updates the `changedAt` attribute from current store, and create a new entry
 * in stores entry with updated word
 */
Store.prototype.push = function (word) {
    const currentDate = new Date();
    this.store.changedAt = currentDate;
    this._store.push({
        data: this.store.data.concat([word]),
        createdAt: currentDate,
        changedAt: currentDate,
    })
    this.store = this._store[this._store.length - 1];
}
/**
 * @return {String} retrieve a specific word from an index of current store
 */
Store.prototype.get = function (idx) {
    return this.store.data[idx];
}
/**
 * @return {Number} the size of current store data
 */
Store.prototype.size = function () {
    return this.store.data.length;
}
/**
 * @return {Boolean} if a specific word exists in the store
 */
Store.prototype.exists = function (word) {
    return (this.store.data.lastIndexOf(word) !== -1);
} 
/**
 * Promise based Store interface
 * @class Dao
 * @see Store
 */
function Dao(InjectedStore) {
    const OptionnalyFakeStore = InjectedStore || new Store();
    this.store = OptionnalyFakeStore;
}
/**
 * @return {Promise<String>} it resolves to a random verb from the store
 * @see Store.get
 */
Dao.prototype.getRandWord = function () {
    const size = this.store.size() - 1;
    const randIdx = Math.floor(
        Math.random() * size
    );
    return new Promise(resolve => resolve(this.store.get(randIdx)));
};
/**
 * @param {String} word the word to add to the store
 * @return {Promise} it resolves when the word is fully included in the store
 * @see Store.push
 */
Dao.prototype.push = function (word) {
    this.store.push(word);
    return new Promise(resolve => resolve());
};
/**
 * @return {Promise} it resolves if the provided word exists in the store, else it rejects
 * @see Store.exists
 */
Dao.prototype.exists = function (word) {
    return new Promise((resolve, reject) => this.store.exists(word) ? resolve() : reject());
}

/* we don't ment to use the store outside this file, it's only a mock */
module.exports = Dao;

/* for test purposes */
module.exports.Store = Store;