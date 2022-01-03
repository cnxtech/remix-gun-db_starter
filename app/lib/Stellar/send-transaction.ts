import StellarSdk from "stellar-sdk";
type SendTxParams = {
  secret: string
  destination: string
  amount: number
}

const HORIZON_API=  process.env.HORIZON_API as string;

const server = new StellarSdk.Server(HORIZON_API || "https://horizon-testnet.stellar.org");

const sendTransaction = async ({secret, destination, amount}:SendTxParams) => {
  try {
    const sourceKeys = StellarSdk.Keypair.fromSecret(secret);

    // check that the account exists to avoid errors
    //     and unnecessary commission charges
    await server.loadAccount(destination);
    const sourceAccount = await server.loadAccount(sourceKeys.publicKey());

    // set up the transaction
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination,
          // Since Stellar allows transactions in different
          // exchange rates, you must specify the currency in which you will send
          // The type "native" refers to Lumens (XLM)
          asset: StellarSdk.Asset.native(),
          amount
        })
      )

// Wait a maximum of three minutes for the transaction
      .setTimeout(180)
      .build();

    
// We signed the transaction to authenticate our identity
    transaction.sign(sourceKeys);
    
// Finally we send it to Stellar
    const result = await server.submitTransaction(transaction);

    return result;
  } catch (err) {
    console.error("An error has occurred", err);
  }
};

export { sendTransaction };
