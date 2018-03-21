const TextEncoder = require('util').TextEncoder;

class SHA3 {
    /**
     * Creates an SHA3 object from an Emscripten Module. It's important that the module is
     * ready to be used
     * @param EmscriptenModule
     */
    constructor(EmscriptenModule) {
        this.em = EmscriptenModule;
    }

    /**
     * Allocates the needed memory in the WebAssembly module and returns two pointers
     * @param {number} messageBytes - Number of bytes of the incoming message
     * @param {number} hashBytes - Number of bytes of the outcoming hash
     * @returns {{messagePointer, hashPointer}}
     */
    allocMemory(messageBytes, hashBytes) {
        const messagePointer = this.em._malloc(messageBytes);
        const hashPointer = this.em._malloc(hashBytes);

        return {
            messagePointer,
            hashPointer
        }
    }

    /**
     * Transform a string to a Uint8Array
     * @param {string} string - String to be transformed in a Uint8Array
     * @returns {Uint8Array}
     */
    static stringToUint8Array(string) {
        return new TextEncoder().encode(string);
    }

    /**
     * Copy an argument to the memory of the WebAssembly Module
     * @param {number} memoryPointer - Pointer to the memory
     * @param {Uint8Array} uint8array - Value to by copied
     * @returns {boolean}
     */
    copyArgumentToMemory(memoryPointer, uint8array) {
        let dataHeap = new Uint8Array(this.em.HEAPU8.buffer, memoryPointer, uint8array.length * uint8array.BYTES_PER_ELEMENT);
        dataHeap.set(uint8array);

        return true;
    }

    /**
     * Copy bytes from the WebAssembly module to a new Uint8Array
     * @param {number} memoryPointer - Pointer to the memory
     * @param {number} numberOfBytes - Number of bytes to be copied
     * @returns {Uint8Array}
     */
    copyBytesFromMemory(memoryPointer, numberOfBytes) {
        return new Uint8Array(this.em.HEAPU8.buffer, memoryPointer, numberOfBytes);
    }

    /**
     * Transforms a Uint8Array to a heximal string
     * @param {Uint8Array} byteArray - The Uint8Array to be transformed
     * @returns {string}
     */
    static toHexString(byteArray) {
        return Array.prototype.map.call(byteArray, function(byte) {
            return ('0' + byte.toString(16)).slice(-2);
        }).join('');
    }

    /**
     * Returns a sha3 512 bit hash as hexadecimal string
     * @param {string} string - String to be hashed
     * @returns {string}
     */
    sha3_512(string) {
        return this.wasm_sha('SHA3_512', string, 64);
    }

    /**
     * Returns a sha3 384 bit hash as hexadecimal string
     * @param {string} string - String to be hashed
     * @returns {string}
     */
    sha3_384(string) {
        return this.wasm_sha('SHA3_384', string, 48);
    }

    /**
     * Returns a sha3 256 bit hash as hexadecimal string
     * @param {string} string - String to be hashed
     * @returns {string}
     */
    sha3_256(string) {
        return this.wasm_sha('SHA3_256', string, 32);
    }

    /**
     * Returns a sha3 224 bit hash as hexadecimal string
     * @param {string} string - String to be hashed
     * @returns {string}
     */
    sha3_224(string) {
        return this.wasm_sha('SHA3_224', string, 28);
    }

    /**
     * Returns a shake128 hash with a given number of bytes
     * @param {string} string - String to be hashed
     * @param {number} numberOfOutputBytes
     * @returns {string}
     */
    shake128(string, numberOfOutputBytes) {
        return this.wasm_shake('SHAKE128', string, numberOfOutputBytes)
    }

    /**
     * Returns a shake256 hash with a given number of bytes
     * @param {string} string - String to be hashed
     * @param {number} numberOfOutputBytes
     * @returns {string}
     */
    shake256(string, numberOfOutputBytes) {
        return this.wasm_shake('SHAKE256', string, numberOfOutputBytes)
    }

    /**
     * Use the WebAssembly Module to create a hash
     * @param {string} hashFunction
     * @param {string} string - String to be hashed
     * @param {number} outputBytes - Number of output bytes
     * @returns {string}
     */
    wasm_sha(hashFunction, string, outputBytes) {
        const hashBytes = outputBytes;
        const message = SHA3.stringToUint8Array(string);
        const allocatedMemory = this.allocMemory(message.length * message.BYTES_PER_ELEMENT, hashBytes);
        this.copyArgumentToMemory(allocatedMemory.messagePointer, message);
        this.em.ccall(hashFunction, null, ['number', 'number', 'number'], [allocatedMemory.messagePointer, message.length * message.BYTES_PER_ELEMENT, allocatedMemory.hashPointer]);
        const hash = this.copyBytesFromMemory(allocatedMemory.hashPointer, hashBytes);

        return SHA3.toHexString(hash);
    }

    /**
     * Use the WebAssembly Module to create a shake hash of a given length of bytes
     * @param {string} shakeFunction
     * @param {string} string
     * @param {number} outputBytes
     * @returns {string}
     */
    wasm_shake(shakeFunction, string, outputBytes) {
        const hashBytes = outputBytes;
        const message = SHA3.stringToUint8Array(string);
        const allocatedMemory = this.allocMemory(message.length * message.BYTES_PER_ELEMENT, hashBytes);
        this.copyArgumentToMemory(allocatedMemory.messagePointer, message);
        this.em.ccall(shakeFunction, null, ['number', 'number', 'number', 'number'], [allocatedMemory.messagePointer, message.length * message.BYTES_PER_ELEMENT, allocatedMemory.hashPointer, hashBytes]);
        const hash = this.copyBytesFromMemory(allocatedMemory.hashPointer, hashBytes);

        return SHA3.toHexString(hash);
    }
}

module.exports = SHA3;
