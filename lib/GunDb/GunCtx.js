// "use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = exports.decrypt = exports.encrypt = void 0;
/* eslint-disable react-hooks/exhaustive-deps */
require("gun/lib/radix");
require("gun/lib/radisk");
require("gun/lib/store");
require("gun/lib/rindexed");
const lz_string_1 = __importDefault(require("lz-string"));
const gun_1 = __importDefault(require("gun"));
// import { getUserSession, master } from '~/session.server';
const encrypt = (data, keys, sign = false) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Encrypting data with new keys...');
    let enc = yield gun_1.default.SEA.encrypt(data, JSON.stringify(keys));
    var _data = yield gun_1.default.SEA.sign(enc, keys);
    if (sign === true) {
        return _data;
    }
    return lz_string_1.default.compress(_data);
});
exports.encrypt = encrypt;
const decrypt = (data, keys, verify = false) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Encrypting data with new keys...');
    let enc = lz_string_1.default.decompress(data);
    var msg = yield gun_1.default.SEA.verify(enc, keys.pub);
    if (verify === true) {
        return msg;
    }
    return yield gun_1.default.SEA.decrypt(msg, JSON.stringify(keys));
});
exports.decrypt = decrypt;
function GunCtx(env) {
    const ports = {
        DOMAIN: env.DOMAIN,
        RELAY: env.GUN_PORT,
        CLIENT: env.CLIENT_PORT
    };
    const master = {
        pub: env.PUB,
        priv: env.PRIV,
        epub: env.EPUB,
        epriv: env.EPRIV
    };
    if (!ports || !master)
        throw new Error('Run "yarn generate" or "npm run generate" to generate your keypair then set it in your environment variables');
    const gun = new gun_1.default({
        file: `${ports.DOMAIN}.private_relay`,
        peers: [`http://0.0.0.0:${ports.RELAY}gun`, `http://${ports.DOMAIN}:${ports.RELAY}gun` || `htts://${ports.DOMAIN}:${ports.RELAY}gun`],
        localStorage: false,
        radisk: true
    });
    // eslint-disable-next-line require-yield
    const createUser = ({ alias, idString }) => __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            /** Generate Keypair */
            const pair = yield gun_1.default.SEA.pair();
            const exists = yield getVal(`@${pair.pub}`, 'creds');
            if (exists) {
                resolve({ ok: false, result: 'Alias already exists' });
            }
            const a = {
                pub: pair.pub,
                priv: pair.priv
            };
            const e = {
                pub: pair.epub,
                priv: pair.epriv
            };
            /** Encrypt && Sign */
            const comp = yield (0, exports.encrypt)({ a: alias, i: idString, e: e }, a);
            console.info(`\n \n **** COMPRESSED USER DATA ****  — size:  ${comp.length} — \n \n${comp}\n \n`);
            /** Store user data */
            let store = yield putVal(`@${alias}`, 'creds', comp);
            if (!store)
                resolve({ ok: false, result: 'Could not store credentials' });
            /** else */
            resolve({ ok: true, result: comp, keys: { auth: a, enc: e, phrase: idString } });
        }));
    });
    const validate = (pair) => new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        let stored = yield getVal(`@${pair.pub}`, 'creds');
        if (!stored)
            resolve({ ok: false, result: 'Alias Not Found' });
        console.log(`\n \n **** stored data **** \n \n  ${stored}`);
        let dec = yield (0, exports.decrypt)(stored, pair);
        console.log(`\n \n **** decrypted **** \n \n  ${dec}`);
        let proof = yield gun_1.default.SEA.work(dec, pair);
        console.log(`\n \n **** Hashing decrypted data and keypair **** \n \n  ${proof}`);
        if (!proof) {
            console.error('Keys invalid');
            resolve({ ok: false, result: 'Keys invalid' });
        }
        resolve({ ok: true, result: dec });
    }));
    const putVal = (document, key, value, encryptionKey) => __awaiter(this, void 0, void 0, function* () {
        if (encryptionKey) {
            value = yield (0, exports.encrypt)(value, encryptionKey);
        }
        value = yield (0, exports.encrypt)(value, master);
        return new Promise((resolve) => gun.get(document).get(key).put(value, (ack) => {
            var _a, _b;
            console.log(ack);
            resolve(ack.ok ? 'Added data!' : (_b = (_a = ack.err) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : undefined);
        }));
    });
    const getVal = (document, key, decryptionKey) => {
        return new Promise((resolve) => gun.get(document).get(key).once((data) => __awaiter(this, void 0, void 0, function* () {
            console.log('data:', data);
            decryptionKey
                ? resolve(yield (0, exports.decrypt)(data, decryptionKey))
                : resolve(yield (0, exports.decrypt)(data, master));
        })));
    };
    return {
        authenticate: (request) => __awaiter(this, void 0, void 0, function* () {
            let { alias, idString, pub, priv, colorCode } = Object.fromEntries(yield request.formData());
            // let session = await getUserSession(request)
            let fields;
            let err;
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                if (typeof idString !== 'string' || idString.length < 20) {
                    err.string = `Identification string must be at least 15 characters long. Try 'oH pen seSAme SEEDS'. Note: UTF-16 characters accepted `;
                }
                idString = fields.idString;
                if (typeof colorCode !== 'string' || colorCode.length < 6) {
                    err.colorCode = `Color code combo must be of at least 6 `;
                }
                colorCode = fields.colorCode;
                /** set colorcode in session storage and remove it from fields object */
                // session.set('color', colorCode)
                delete fields.colorCode;
                if (typeof alias === 'string') {
                    /** createUser if making new profile */
                    alias = fields.alias;
                    const { ok, result, keys } = yield createUser(fields);
                    if (!ok) {
                        resolve({ ok: false, result });
                    }
                    if (err)
                        resolve({ ok: false, result: err });
                    resolve({ ok: true, result, keys, });
                }
                if (typeof pub !== 'string' && priv !== 'string') {
                    err.keys = 'Was unable to find keys stored in your browser. Please paste in your keys and try again.';
                }
                let keypair = {
                    pub: fields.keys.pub,
                    priv: fields.keys.priv
                };
                /** validate */
                const { ok, result } = yield validate(keypair);
                if (!ok) {
                    err.auth = result;
                }
                console.log(`\n \n result \n \n `);
                console.log(result);
                resolve({ ok: true, result });
            }));
        }),
        isAuthenticated: (request) => __awaiter(this, void 0, void 0, function* () {
        })
    };
}
const createContext = (request, env) => {
    const { authenticate } = GunCtx(env);
    return {
        auth: authenticate(request)
    };
};
exports.createContext = createContext;
