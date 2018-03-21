let initSHA3 = require('./initSHA3');

initSHA3().then(hash => {

    console.log(hash.sha3_224("abc"));
    console.log(hash.sha3_256("abc"));
    console.log(hash.sha3_384("abc"));
    console.log(hash.sha3_512("abc"));

    console.log(hash.shake128("abc", 64));
    console.log(hash.shake256("abc", 64));
});