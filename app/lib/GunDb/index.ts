import {GunCtx } from './GunCtx';








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