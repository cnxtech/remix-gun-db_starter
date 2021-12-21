import StellarSdk from "stellar-sdk";
const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

const loadAccount = async (publicKey: string) => {
  
// We load the account through the STELLAR SDK
  const account = await server.loadAccount(publicKey);

  return account;
};

export { loadAccount };
