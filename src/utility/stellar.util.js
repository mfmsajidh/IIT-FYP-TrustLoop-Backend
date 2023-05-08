import StellarSdk from 'stellar-sdk';

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

//TODO Replace with this with the platform account secret key
const platformSecretKey =
  'SCMMM7YGETYU7S64HARQECYCW6HEXPCDRO6FGLGPVVLIROFKC4DWYFYW';

export const createUserStellarAccount = async () => {
  const keypair = StellarSdk.Keypair.random();
  const platformKeypair = StellarSdk.Keypair.fromSecret(platformSecretKey);
  const platformAccount = await server.loadAccount(platformKeypair.publicKey());

  const transaction = new StellarSdk.TransactionBuilder(platformAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  })
    .addOperation(
      StellarSdk.Operation.createAccount({
        destination: keypair.publicKey(),
        startingBalance: '100', // Sufficient starting balance to cover base reserves and some operations
      })
    )
    .setTimeout(180)
    .build();

  transaction.sign(platformKeypair);
  await server.submitTransaction(transaction);

  return keypair;
};

export const storeHashOnStellar = async (ipfsHash, userSecret, uniqueKey) => {
  try {
    const userKeypair = StellarSdk.Keypair.fromSecret(userSecret);
    const platformAccount = await server.loadAccount(userKeypair.publicKey());

    const transaction = new StellarSdk.TransactionBuilder(platformAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.manageData({
          name: uniqueKey,
          value: ipfsHash,
        })
      )
      .setTimeout(180)
      .build();

    transaction.sign(userKeypair);
    return await server.submitTransaction(transaction);
  } catch (e) {
    console.log(e);
    throw new Error('Stellar record creation failed');
  }
};

export const fetchHashHistory = async (publicKey) => {
  const account = await server.loadAccount(publicKey);
  const dataEntries = account.data_attr;

  return Object.entries(dataEntries)
    .filter(([key]) => key.startsWith('TrustLoop_'))
    .map(([key, value]) => {
      const decodedValue = StellarSdk.StrKey.decodeEd25519PublicKey(value);
      const ipfsHash = Buffer.from(decodedValue).toString('hex');
      return { key, ipfsHash };
    });
};
