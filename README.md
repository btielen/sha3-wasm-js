# sha3-wasm-js
Create SHA3 hashes from strings with the help of WebAssembly

## How to use

```javascript
let initSHA3 = require('./initSHA3');


initSHA3().then(hash => {

    console.log(hash.sha3_224("abc"));
    console.log(hash.sha3_256("abc"));
    console.log(hash.sha3_384("abc"));
    console.log(hash.sha3_512("abc"));

    console.log(hash.shake128("abc", 64));
    console.log(hash.shake256("abc", 64));
});
````


which would result in

```
e642824c3f8cf24ad09234ee7d3c766fc9a3a5168d0c94ad73b46fdf
3a985da74fe225b2045c172d6bd390bd855f086e3e9d525b46bfe24511431532
ec01498288516fc926459f58e2c6ad8df9b473cb0fc08c2596da7cf0e49be4b298d88cea927ac7f539f1edf228376d25
b751850b1a57168a5693cd924b6b096e08f621827444f70d884f5d0240d2712e10e116e9192af3c91a7ec57647e3934057340b4cf408d5a56592f8274eec53f0
5881092dd818bf5cf8a3ddb793fbcba74097d5c526a6d35f97b83351940f2cc844c50af32acd3f2cdd066568706f509bc1bdde58295dae3f891a9a0fca578378
483366601360a8771c6863080cc4114d8db44530f8f1e1ee4f94ea37e78b5739d5a15bef186a5386c75744c0527e1faa9f8726e462a12a4feb06bd8801e751e4
```

## Supported hash functions

The following hash functions are supported, approved as a FIPS standard in August 2015.

- sha3_512
- sha3_384
- sha3_256
- sha3_224
- shake256
- shake128

## Contribute

Help is greatly appreciated. Start with submitting some issues.