var Gun = require('gun'); // in NodeJS
require('gun/sea');

const LZString = require('lz-string');

var SEA = Gun.SEA;
(async () => {
  var pair = await SEA.pair();
  // console.log(pair);
  const hpair = {
    pub: pair.pub,
    priv: pair.priv,
  };
  const ekeys = {
    epub: pair.epub,
    epriv: pair.epriv,
  };

  const pr = {
    pub: hpair.priv,
    priv: ekeys.epriv,
  };
  let creds = {
    alias: 'bresnow',
    password: 'Tout038.',
  };

  const b64 =
    '44qF4YKC4Leg5JCL5pSF7LSD4aCF7IWQ4pyA5pCP5ICRw6zRoOGZgOOUgO+/veeAi+ySgeWQhOWPg8S80LHigbPHhMiy4oCY5KKA4LiA4YuAONWg2KDguZ3ogJVK6rKL5KaI7LGI4YCB45CA77+95oCB5oCZ6JWA4LyA6Lmi74CA5YSS66C95aWF5aek64yPeeGMgeKwgOuQgeqzsOailO+ggOyyoGjqh7zDne2CueKSse6jjOuggOiTiOqhjOiIgOqUmOanpOqjse6KoMad7YGIxKXklITqorjnsIHqlrPqspDqgIHnsJLhr6DqgYQ066CB5LWY5oKYTOeCkdG45JGA5ZSn6IKQ6qKQ6ZSt6pep77+96qKo5JG46KGx4piM56Sn5IuG6YeY5oaj5KqT4LK47JGg4K+94rOI7qm8wqzmoIDnlKLgvJ7siqPij7nriLDjiLvgvYTkiYrgpoLonLHogJ7vv73mjLPqupPhsJPkqoDXoOKQjOiAgA==';
  // var enc = await SEA.encrypt(creds, hpair);
  // var data = await SEA.sign(enc, hpair);
  // // console.log(data);
  // var msg = await SEA.verify(data, hpair.pub);
  // var dec = await SEA.decrypt(msg, hpair);
  const encrypt = async (data, keys) => {
    console.log('Encrypting data with new keys...');
    let enc = await Gun.SEA.encrypt(data, keys);
    var _data = await SEA.sign(enc, keys);
    return LZString.compress(_data);
  };

  const decrypt = async (data, keys, verify) => {
    console.log('Encrypting data with new keys...');
    let enc = LZString.decompress(data);
    var msg = await SEA.verify(enc, keys.pub);
    if (verify === true) {
      return msg;
    }
    let dec = await Gun.SEA.decrypt(msg, keys);
    return dec;
  };

  let enc = await encrypt(b64, pair);
  console.log(enc);
  let dec = await decrypt(enc, pair);
  var proof = await SEA.work(dec, hpair);
  var check = await SEA.work(creds, hpair);
  console.log(proof === check);
  console.log(dec);
  // console.log(proof === check);
  // // now let's share private data with someone:
  // var alice = await SEA.pair();
  // var bob = await SEA.pair();
  // var enc = await SEA.encrypt('shared data', await SEA.secret(bob.epub, alice));
  // await SEA.decrypt(enc, await SEA.secret(alice.epub, bob));
  // // `.secret` is Elliptic-curve Diffie–Hellman
  // // Bob allows Alice to write to part of his graph, he creates a certificate for Alice
  // var certificate = await SEA.certify(alice.pub, ['^AliceOnly.*'], bob);
  // console.log(certificate);
  // // Alice logs in
  // const gun = Gun();
  // await gun.user().auth(alice);
  // // and uses the certificate
  // await gun
  //   .get('~' + bob.pub)
  //   .get('AliceOnly')
  //   .get('do-not-tell-anyone')
  //   .put(enc, null, { opt: { cert: certificate } });
  // await gun
  //   .get('~' + bob.pub)
  //   .get('AliceOnly')
  //   .get('do-not-tell-anyone')
  //   .once(console.log); // return 'enc'
})();
