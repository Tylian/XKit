XKit.storage = (function() {
  var database = {};

  function get_used() {
    return 0;
  }

  function set(name, value) {
    postRPC('set', {
      name: name,
      value: value
    });
  }

  function get(name, defaultValue) {
    if (database.hasOwnProperty(name)) {
      return database[name];
    }
    return defaultValue;
  }

  function delete_all() {
    postRPC('delete_all', {});
  }

  function clear(name) {
    postRPC('delete', {name: name});
  }

  return {
    get: get,
    get_used: get_used,
    set: set,
    delete_all: delete_all,
    'delete': clear
  };
})();
