var events = {};
let alreadyExistsEmit = [];
function on(name, self, callback) {
    var tuple = [self, callback];
    var callbacks = events[name];
    if (Array.isArray(callbacks)) {
        callbacks.push(tuple);
    }
    else {
        events[name] = [tuple];
    }
}

function remove(name, self) {
    var callbacks = events[name];
    if (Array.isArray(callbacks)) {
        events[name] = callbacks.filter((tuple) => {
            return tuple[0] != self;
        });
    }
}

function emit() {
    const [name, ...data] = arguments;
    var callbacks = events[name];
    alreadyExistsEmit.push(name);
    if (Array.isArray(callbacks)) {
        callbacks.map((tuple) => {
            var self = tuple[0];
            var callback = tuple[1];
            callback.call(self, ...data);
        });
    }
}

function getBindState(callback, isHideLoading) {
    const tip = require("./tip");
    const libs = require("../libs/index");
    const {isbind} = libs.Session.get() || {};
    !isHideLoading && isbind && tip.showToast();
    if (isbind) {
      callback(isbind);
    } else if (!alreadyExistsEmit.includes("setBind")) {
      on("setBind", this, function(data) {
        callback(data);
      });
    } else {
      callback(false);
    }
  }

exports.on = on;
exports.remove = remove;
exports.emit = emit;
exports.getBindState = getBindState;