const Init_EmscriptenModule = require('./EmscriptenModule.js');
const SHA3 = require('./SHA3.js');

/**
 * Promise to give a SHA3 class
 * @type {Promise}
 */
let promiseSHA3 = new Promise(function(resolve, reject) {

    Init_EmscriptenModule().then(function(Module) {
        resolve(new SHA3(Module));
    });


});

let initSHA3 = function() {
    return promiseSHA3
};

module.exports = initSHA3;