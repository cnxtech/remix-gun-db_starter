const SEA = require('gun/sea');

SEA.pair().then((pair) => {
  console.log(
    'This is your secret app key pair.\nAdd this to your .dotenv file:'
  );
  console.log(`APP_KEY_PAIR='${JSON.stringify(pair)}'`);
});

// const Gun = require('gun')
// const gun = Gun()

// const user = gun.user()

// // user.create('testconsole', 'test12345', (x) => {
// //   console.log(x)
// // })

// gun.on('auth', ack => console.log('Authentication was successful: ', ack.sea.pub + ack.sea.priv))

// user.auth('testconsole', 'test12345')

