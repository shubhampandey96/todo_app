// utils/context.js
const { AsyncLocalStorage } = require('async_hooks');

// Create an AsyncLocalStorage instance (replacement for cls-hooked)
const asyncLocalStorage = new AsyncLocalStorage();

module.exports = {
  run: (store, callback) => asyncLocalStorage.run(store, callback),

  getStore: () => asyncLocalStorage.getStore(),

  set: (key, value) => {
    const store = asyncLocalStorage.getStore();
    if (store) {
      store.set(key, value);
    }
  },

  get: (key) => {
    const store = asyncLocalStorage.getStore();
    return store ? store.get(key) : undefined;
  },
};
