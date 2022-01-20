import Gun from 'gun'
import { IGunConstructorOptions } from 'gun/types/options';



export const getGun = (options: IGunConstructorOptions) => {
    const db = new Gun(options)
    return db
}
const ports = {
    RELAY: process.env.GUN_PORT || 5150,
    CLIENT: process.env.CLIENT_PORT || 3333,
};
export const peers = [
    `http://localhost:${ports.RELAY}/gun`,
    `http://localhost:${ports.CLIENT}`,
    'https://relay.peer.ooo/gun',
    'https://replicant.adamantium.online/gun',
    'http://gun-matrix.herokuapp.com/gun',
    'https://gun-ams1.maddiex.wtf:443/gun',
    'https://gun-sjc1.maddiex.wtf:443/gun',
    'https://shockblox-gun-server.herokuapp.com/gun',
    'https://mg-gun-manhattan.herokuapp.com/gun',
    'https://gunmeetingserver.herokuapp.com/gun',
    'https://gun-eu.herokuapp.com/gun',
    'https://gunjs.herokuapp.com/gun',
    'https://myriad-gundb-relay-peer.herokuapp.com/gun',
    'https://gun-armitro.herokuapp.com/',
    'https://fire-gun.herokuapp.com/gun',
    'http://34.101.247.230:8765/gun',
    'https://gun-manhattan.herokuapp.com/gun',
    'https://us-west.xerberus.net/gun',
    'https://dletta.rig.airfaas.com/gun',
    'https://e2eec.herokuapp.com/gun']

export const loc = getGun({ peers: ['http://localhost:3333/gun'] })


// const signAction = async (request: Request) => {
//   let { username, password } = Object.fromEntries(
//     await request.formData()
//   );
//   let fields
//   return new Promise((resolve) => {
//     if (
//       typeof username !== 'string'
//     ) {
//       return resolve({ ok: false, result: `Please enter username` });
//     }
//     if (typeof password === 'string')
//       fields = { username, password };

//     let fields2 = { alias: username, job: 'Add Job Title', description: 'Add Job Description' }
//     let fieldErrors = {
//       username: validateUsername(username),
//       // password: validatePassword(password),
//     };
//     if (fieldErrors.username) resolve({ ok: false, result: fieldErrors.username });
//     // if (fieldErrors.password) resolve({ ok: false, result: fieldErrors.password });
//     gun.get(`~@${username}`).once(async (exist) => {

//       let pair = await Gun.SEA.pair()
//       let PRIV_KEY = pair.epriv

//       if (!exist) {
//         const { ok, result } = await createUser(fields.username, PRIV_KEY);
//         if (!ok) {
//           resolve({ ok: false, result: result });
//         }
//         const { ok: ok2, result: res2 } = await login(fields.username, PRIV_KEY);
//         if (!ok2) {
//           resolve({ ok: ok2, result: res2 });
//         }
//         const res = await putVal(`+${username}`, 'master', pair);
//         if (res !== 'Added data!') {
//           resolve({ ok: false, result: 'Error Storing Keys' });
//         }
//         resolve(createUserSession(pair, `/admin/${fields.username}`))
//       }
//       const { ok: ok3, result: res3 } = await login(fields.username, fields.password);
//       if (!ok3) {
//         resolve({ ok: ok3, result: res3 });
//       }
//       let loginPair = await getVal(`+${username}`, 'master')
//       resolve(createUserSession(loginPair as IGunCryptoKeyPair, `/admin/${fields.username}`))
//     })
//   }
//   )
// }