import StellarSdk from 'stellar-sdk';

const pair = StellarSdk.Keypair.random();

const createWallet = () => {
  // We create our pair of keys
  const secret = pair.secret();
  const publicKey = pair.publicKey();

  return {
    secret: secret,
    public: publicKey,
  };
};

const activeWallet = async (publicKey: string) => {
  // We request the activation of our Stellar Friendbot account
  const response = await fetch(
    `https://friendbot.stellar.org?addr=${publicKey}`
  );

  // We show the result of the answer
  const responseJSON = await response.json();

  return responseJSON;
};

export { createWallet, activeWallet };
